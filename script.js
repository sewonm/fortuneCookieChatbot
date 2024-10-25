const apiKey = 'sk-NfyU6HVi1BMLXbxE6B_4Ez0BFU-rsWUSjN2IYRAhmgT3BlbkFJAV00TDGYhvOGWaxQM14UltnpQSD0rtq51BPis3Iu0A'; // Replace with your OpenAI API key

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

// Fortune cookie introduction on page load
window.onload = function() {
    const introMessage = `Welcome, seeker of wisdom! I am your digital fortune cookie. Ask me anything, and I will give you short and sweet words of wisdom, just like the fortunes you find in your favorite cookies.`;

    displayMessage(introMessage, 'bot');
};

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    displayMessage(userInput, 'user');

    // Add personality traits in the prompt for the fortune cookie
    const fortuneCookiePrompt = `You are a wise fortune cookie. Respond with short, cryptic, yet thoughtful fortunes, just like a message someone would find inside a fortune cookie. The user has asked: "${userInput}"`;

    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: 'You are a fortune cookie that gives short, wise, and cryptic fortunes.' },
                    { role: 'user', content: fortuneCookiePrompt }
                ]
            })
        });

        const data = await response.json();
        const botMessage = data.choices[0].message.content;
        displayMessage(botMessage, 'bot');
    } catch (error) {
        displayMessage("Hmm, the cookie crumbled... please try again.", 'bot');
    }

    document.getElementById('user-input').value = '';
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}