export class Logger {
  constructor(events, enabled=false) { this.events=events; this.enabled=enabled; }
  info(scope, message, data) { if (this.enabled) console.info(`[${scope}] ${message}`,data ?? ''); this.events.emit('debug:log',{level:'info',scope,message,data}); }
  warn(scope, message, data) { console.warn(`[${scope}] ${message}`,data ?? ''); this.events.emit('debug:log',{level:'warn',scope,message,data}); }
  error(scope, message, error) { console.error(`[${scope}] ${message}`,error); this.events.emit('debug:log',{level:'error',scope,message,error:String(error)}); }
}
