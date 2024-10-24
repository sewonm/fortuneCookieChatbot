const chatMessages = document.getElementById('chat-messages');
const userInput = document.getElementById('user-input');

async function sendMessage() {
  const message = userInput.value.trim();
  if (message === '') return;

  addMessage('user', message);
  userInput.value = '';

  try {
    const response = await axios.post('/api/chat', { message });
    addMessage('bot', response.data.reply);
  } catch (error) {
    console.error('Error:', error);
    addMessage('bot', 'Sorry, I encountered an error.');
  }
}

function addMessage(sender, message) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = message;
  chatMessages.appendChild(messageElement);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}