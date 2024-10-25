async function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (!userInput) return;

    displayMessage(userInput, 'user');

    // Open the fortune cookie only when user submits a message
    openCookie();

    try {
        // Use a relative path for the API endpoint, which works on both localhost and deployed environments
        const response = await fetch('/api/chat', {
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
