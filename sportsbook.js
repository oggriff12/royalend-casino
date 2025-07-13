// Fake odds loader (you can later link to real APIs)
document.getElementById('odds-list').innerHTML = `
  <div>🏀 Lakers vs Heat: Lakers -110 / Heat +100</div>
  <div>⚽ Arsenal vs Chelsea: Arsenal -120 / Draw +250</div>
  <div>🏈 Chiefs vs Bengals: Chiefs -130 / Bengals +110</div>
`;

// Basic live chat (non-persistent)
const chatBox = document.getElementById('chat-box');
const input = document.getElementById('chat-input');
const sendBtn = document.getElementById('send-btn');

sendBtn.onclick = () => {
  if (input.value.trim() !== '') {
    const msg = document.createElement('div');
    msg.textContent = `🗣️ ${input.value}`;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = '';
  }
};
