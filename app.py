import streamlit as st
from groq import Groq
import time

# 1. 페이지 설정
st.set_page_config(page_title="번개 챗봇 AI", page_icon="⚡")
st.title("⚡ 번개 챗봇 AI")
st.markdown("---")

# 2. API 키 설정 (st.secrets 사용)
client = Groq(api_key=st.secrets["GROQ_API_KEY"])

# 3. 세션 상태 초기화
if "messages" not in st.session_state:
    st.session_state.messages = [
        {"role": "system", "content": "너는 코딩을 아주 쉽게 알려주는 친절한 선생님이야. 비유를 들어서 초등학생도 이해할 수 있게 설명해줘."}
    ]

# 4. 사이드바 구성 (대화 지우기 & FAQ 버튼)
with st.sidebar:
    st.header("⚙️ 설정 및 도구")
    
    # 대화 지우기 버튼
    if st.button("🔄 대화 내용 지우기", use_container_width=True):
        st.session_state.messages = [st.session_state.messages[0]]
        st.rerun()
    
    st.markdown("---")
    
    # [아이디어 4번] FAQ 퀵 버튼
    st.subheader("💡 자주 묻는 질문")
    faq_questions = ["파이썬이 뭐야?", "변수가 뭐야?", "반복문 예제 보여줘", "리스트가 뭐야?"]
    
    # FAQ 버튼 클릭 시 입력값으로 저장
    faq_selected = None
    for q in faq_questions:
        if st.button(q, use_container_width=True):
            faq_selected = q

# 5. 기존 대화 기록 출력
for message in st.session_state.messages:
    if message["role"] != "system":
        with st.chat_message(message["role"]):
            st.markdown(message["content"])

# 6. 사용자 입력 처리 (채팅창 입력 OR FAQ 버튼 클릭)
prompt = st.chat_input("질문을 입력하세요...")
if faq_selected:
    prompt = faq_selected

if prompt:
    # 사용자 메시지 저장 및 출력
    st.session_state.messages.append({"role": "user", "content": prompt})
    with st.chat_message("user"):
        st.markdown(prompt)

    # AI 답변 생성
    with st.chat_message("assistant", avatar="⚡"):
        response_placeholder = st.empty()
        full_response = ""
        
        # [아이디어 5번] 성능 측정을 위한 시작 시간
        start_time = time.time()
        
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": m["role"], "content": m["content"]} for m in st.session_state.messages],
            stream=True
        )

        for chunk in completion:
            content = chunk.choices[0].delta.content
            if content:
                full_response += content
                response_placeholder.markdown(full_response + "▌")
        
        # 최종 답변 확정
        response_placeholder.markdown(full_response)
        
        # [아이디어 5번] 시간 측정 및 하단 캡션 표시
        end_time = time.time()
        duration = end_time - start_time
        
        # 참고: Stream 모드에서는 정확한 토큰 수를 실시간 계산하기 어려우므로 
        # 글자 수와 소요 시간을 기반으로 '번개 속도'를 표시합니다.
        st.caption(f"⚡ 답변 완료! | 소요 시간: {duration:.2f}초 | 응답 속도: {len(full_response)/max(duration, 1):.1f} chars/sec")

    # 답변 저장
    st.session_state.messages.append({"role": "assistant", "content": full_response})