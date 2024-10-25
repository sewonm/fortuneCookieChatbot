document.getElementById('send-btn').addEventListener('click', sendMessage);
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') sendMessage();
});

window.onload = function() {
    // Update the intro message to be purely informational with no "Hello" greeting
    const introMessage = `Welcome, seeker of wisdom! I am your digital fortune cookie. Ask me anything, and I will give you short and sweet words of wisdom, just like the fortunes you find in your favorite cookies.`;
    displayMessage(introMessage, 'bot'); // This message is more like an intro, not a "Hello!"
};

// Only trigger openCookie when the message is submitted
function openCookie() {
    const cookieImg = document.getElementById('fortune-cookie');
    cookieImg.style.opacity = '0';

    setTimeout(() => {
        cookieImg.src = 'FCOpen.jpg'; // Change to open cookie image

        // Fade back in
        setTimeout(() => {
            cookieImg.style.opacity = '1';
        }, 100);

        // After 5 seconds, fade out and switch back to closed cookie
        setTimeout(() => {
            cookieImg.style.opacity = '0';
            setTimeout(() => {
                cookieImg.src = 'FCClosed.avif.png'; // Change back to closed cookie image
                setTimeout(() => {
                    cookieImg.style.opacity = '1'; // Fade back in
                }, 100);
            }, 500); 
        }, 5000); 
    }, 500);
}

async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    displayMessage(userInput, 'user');

    // Open the fortune cookie only when user submits a message
    openCookie();

    try {
        const response = await fetch('http://localhost:5004/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userInput })
        });

        const data = await response.json();

        // Log the full response data for debugging
        console.log("Full API response from server:", data);

        // Check if the response has the expected content
        if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
            displayMessage(data.choices[0].message.content, 'bot');
        } else {
            displayMessage("The fortune cookie is silent... Please try again.", 'bot');
        }
    } catch (error) {
        console.error("Error fetching response:", error);
        displayMessage("The fortune cookie encountered an error. Please try again.", 'bot');
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
