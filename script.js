// script.js
const messages = document.getElementById("messages");
const chatInput = document.getElementById("chat-input");
const sendButton = document.getElementById("send-button");

// 메시지를 화면에 추가
function addMessage(message, isUser = true) {
    const messageDiv = document.createElement("div");
    messageDiv.textContent = message;
    messageDiv.style.textAlign = isUser ? "right" : "left";
    messages.appendChild(messageDiv);
    messages.scrollTop = messages.scrollHeight; // 스크롤 자동 이동
}

// 메시지 전송
sendButton.addEventListener("click", () => {
    const userMessage = chatInput.value.trim();
    if (userMessage) {
        addMessage(userMessage);
        chatInput.value = "";

        // 간단한 봇 응답 추가
        setTimeout(() => addMessage("Bot: Hello! 😊", false), 500);
    }
});

// Enter 키로 메시지 전송
chatInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        sendButton.click();
    }
});

const socket = io();

// 메시지 보내기
document.getElementById("send-button").addEventListener("click", () => {
    const message = document.getElementById("chat-input").value;
    socket.emit("chat message", message);
});

// 서버 메시지 받기
socket.on("chat message", (msg) => {
    const messages = document.getElementById("messages");
    const newMsg = document.createElement("div");
    newMsg.textContent = msg;
    messages.appendChild(newMsg);
});

const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // 모든 클라이언트에 메시지 브로드캐스트
    });
});

const axios = require('axios');

async function getAIResponse(userMessage) {
    const response = await axios.post('https://api.openai.com/v1/completions', {
        prompt: `User: ${userMessage}\nAI:`,
        model: 'text-davinci-003',
        max_tokens: 50,
    }, {
        headers: { Authorization: `Bearer YOUR_API_KEY` }
    });

    return response.data.choices[0].text.trim();
}
