#!/usr/bin/env python3
"""Ashenwild Frontier demo host.

This is deliberately dependency-free so the RPG foundation can be run with a
single Python command.  It serves the WebGL client and exposes a small,
validated action-intent endpoint.  The endpoint is an authority boundary
example, not a replacement for production authentication/persistence.
"""
from __future__ import annotations

import json
import mimetypes
import os
import re
import time
import uuid
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent / "rpg"
MAX_BODY_BYTES = 8_192
MAX_WORLD_COORDINATE = 1_000
VALID_INTENTS = {"move", "combat", "interact", "respawn"}
VALID_COMBAT_ACTIONS = {"light_1", "light_2", "light_3", "heavy", "rift", "air", "ultimate"}
COMBAT_COOLDOWNS = {"light_1": 0.08, "light_2": 0.08, "light_3": 0.08, "heavy": 1.15, "rift": 4.4, "air": 0.8, "ultimate": 16.0}
TARGET_RE = re.compile(r"^[a-z0-9_-]{1,96}$")
SESSIONS: dict[str, dict[str, Any]] = {}


class GameRequestHandler(SimpleHTTPRequestHandler):
    server_version = "AshenwildDemo/0.1"

    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self) -> None:
        self.send_header("X-Content-Type-Options", "nosniff")
        self.send_header("Cross-Origin-Resource-Policy", "same-origin")
        # The demo host intentionally avoids browser caching so live world-data edits are visible
        # on a normal preview reload. A production CDN should fingerprint and cache assets instead.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()

    def do_GET(self) -> None:  # noqa: N802
        if self.path.split("?", 1)[0] == "/api/health":
            self.send_json(HTTPStatus.OK, {"ok": True, "authority": "demo-intent-gateway", "serverTime": time.time()})
            return
        super().do_GET()

    def do_POST(self) -> None:  # noqa: N802
        if self.path.split("?", 1)[0] != "/api/action":
            self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint")
            return
        try:
            length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            length = 0
        if length <= 0 or length > MAX_BODY_BYTES:
            self.send_json(HTTPStatus.REQUEST_ENTITY_TOO_LARGE, {"approved": False, "reason": "Invalid request size"})
            return
        try:
            payload = json.loads(self.rfile.read(length))
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(HTTPStatus.BAD_REQUEST, {"approved": False, "reason": "Malformed JSON"})
            return
        approved, reason = validate_payload(payload)
        if not approved:
            self.send_json(HTTPStatus.UNPROCESSABLE_ENTITY, {"approved": False, "reason": reason})
            return
        session_id = payload.get("sessionId") or f"guest-{uuid.uuid4()}"
        # In production, obtain session identity from an authenticated credential;
        # never trust a client-supplied identity as this demo does.
        state = SESSIONS.setdefault(session_id, {"lastAction": 0.0, "lastCombat": 0.0, "cooldowns": {}, "position": {"x": -10, "z": 9}})
        now = time.monotonic()
        if now - state["lastAction"] < 0.03:
            self.send_json(HTTPStatus.TOO_MANY_REQUESTS, {"approved": False, "reason": "Intent rate limited"})
            return
        state["lastAction"] = now
        intent = payload["intent"]
        if intent["type"] == "move":
            state["position"] = {"x": intent["position"]["x"], "z": intent["position"]["z"]}
        if intent["type"] == "combat":
            action = intent["action"]
            if now - state["lastCombat"] < 0.05:
                self.send_json(HTTPStatus.TOO_MANY_REQUESTS, {"approved": False, "reason": "Combat rate limited"})
                return
            ready_at = state["cooldowns"].get(action, 0.0)
            if now < ready_at:
                self.send_json(HTTPStatus.CONFLICT, {"approved": False, "reason": "Server cooldown active"})
                return
            state["lastCombat"] = now
            state["cooldowns"][action] = now + COMBAT_COOLDOWNS[action]
        # Damage, XP, currency and drop values are deliberately absent from the wire format.
        self.send_json(HTTPStatus.OK, {"approved": True, "receipt": str(uuid.uuid4()), "serverTime": time.time()})

    def send_json(self, status: HTTPStatus, body: dict[str, Any]) -> None:
        content = json.dumps(body, separators=(",", ":")).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(content)))
        self.end_headers()
        self.wfile.write(content)

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"[{self.log_date_time_string()}] {self.address_string()} {fmt % args}")


def validate_payload(payload: Any) -> tuple[bool, str]:
    if not isinstance(payload, dict) or not isinstance(payload.get("intent"), dict):
        return False, "Intent object required"
    intent = payload["intent"]
    intent_type = intent.get("type")
    if intent_type not in VALID_INTENTS:
        return False, "Unsupported intent"
    allowed_fields = {"move": {"type", "position"}, "combat": {"type", "action", "targetId"}, "interact": {"type", "targetId"}, "respawn": {"type"}}
    if set(intent) - allowed_fields[intent_type]:
        return False, "Unexpected client-controlled state"
    if intent_type == "move":
        position = intent.get("position")
        if not isinstance(position, dict) or not all(isinstance(position.get(axis), (int, float)) for axis in ("x", "z")):
            return False, "Movement coordinates required"
        if any(abs(position[axis]) > MAX_WORLD_COORDINATE for axis in ("x", "z")):
            return False, "Movement outside permitted range"
    if intent_type == "combat":
        if intent.get("action") not in VALID_COMBAT_ACTIONS or not TARGET_RE.fullmatch(intent.get("targetId", "")):
            return False, "Invalid combat intent"
    return True, ""


def main() -> None:
    port = int(os.environ.get("PORT", "8000"))
    if not ROOT.is_dir():
        raise SystemExit(f"Game client directory not found: {ROOT}")
    mimetypes.add_type("text/javascript", ".js")
    server = ThreadingHTTPServer(("0.0.0.0", port), GameRequestHandler)
    print(f"Ashenwild Frontier running at http://0.0.0.0:{port}")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print("\nShutting down.")
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
