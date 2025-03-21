const chatContainer = document.createElement('div');
chatContainer.id = 'chat-container';
document.body.appendChild(chatContainer);

const link = document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = chrome.runtime.getURL('styles.css');
document.head.appendChild(link);

chatContainer.innerHTML = `
  <h1>YouTube ChatAI Assistant</h1>
  <div id="chat-history"></div>
  <form id="chat-form">
    <input type="text" id="user-input" placeholder="Enter your message">
    <button type="submit">Send</button>
  </form>
  <div id="loader">
    <img src="${chrome.runtime.getURL('loader.gif')}" width="150px" alt="Loading...">
  </div>
`;

const chatHistory = document.getElementById('chat-history');
const userInput = document.getElementById('user-input');
const form = document.getElementById('chat-form');

async function sendMessage() {
  const userMessage = userInput.value;
  userInput.value = '';
  const videoUrl = window.location.href;
  console.log(userMessage);
  console.log('Video URL:', videoUrl);
  try {
    const response = await fetch('http://localhost:3000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userInput: userMessage, videoUrl: videoUrl }),
    });

    const data = await response.json();
    console.log(data);
    const botMessage = data.response;
    console.log(botMessage);
    chatHistory.innerHTML += `<div class="user-message">${userMessage}</div>`;
    chatHistory.innerHTML += `<div class="bot-message">${botMessage}</div>`;

    chatHistory.scrollTop = chatHistory.scrollHeight;
  } catch (error) {
    console.error('Error:', error);
  }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const loader = document.getElementById('loader');
  loader.style.display = 'block';
  sendMessage().finally(() => {
    loader.style.display = 'none';
  });
});
