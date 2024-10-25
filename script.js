const apiKey = 'sk-NfyU6HVi1BMLXbxE6B_4Ez0BFU-rsWUSjN2IYRAhmgT3BlbkFJAV00TDGYhvOGWaxQM14UltnpQSD0rtq51BPis3Iu0A'; 

document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});
document.getElementById('user-input').addEventListener('input', openCookie);

let closeTimeout;

window.onload = function() {
    const introMessage = `Welcome, seeker of wisdom! I am your digital fortune cookie. Ask me anything, and I will give you short and sweet words of wisdom, just like the fortunes you find in your favorite cookies.`;
    displayMessage(introMessage, 'bot');
};

// Open the fortune cookie when user starts typing
function openCookie() {
    const cookieImg = document.getElementById('fortune-cookie');
    cookieImg.src = 'open-cookie.png'; // Path to the open fortune cookie image

    // Clear previous close timeout if user is actively typing
    clearTimeout(closeTimeout);

    // Set a timeout to close the cookie if the user stops typing for 3 seconds
    closeTimeout = setTimeout(() => {
        cookieImg.src = 'closed-cookie.png'; // Path to the closed fortune cookie image
    }, 3000);
}

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

    // Keep the cookie open after a message is sent for a short moment before closing it
    const cookieImg = document.getElementById('fortune-cookie');
    cookieImg.src = 'open-cookie.png';
    setTimeout(() => {
        cookieImg.src = 'closed-cookie.png';
    }, 3000);
}

function displayMessage(message, sender) {
    const chatBox = document.getElementById('chat-box');
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.innerText = message;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}