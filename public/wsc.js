document.addEventListener("DOMContentLoaded", () => {
    // More explicit WebSocket URL
    const socketUrl = `ws://${window.location.hostname}:${window.location.port}`;
    console.log("Attempting to connect to:", socketUrl);

    const socket = new WebSocket(socketUrl);

    const messagesContainer = document.querySelector(".messages-container");
    const messageInput = document.getElementById("messageInput");
    const sendButton = document.querySelector(".input-container button");

    // Clear the example messages
    messagesContainer.innerHTML = "";

    // Connection opened
    socket.onopen = () => {
        console.log("Successfully connected to WebSocket server");
        addMessage("System", "Connected to chat server", "received");
    };

    // Listen for messages
    socket.onmessage = (event) => {
        addMessage(location.hostname, event.data, "received");
    };

    // Connection closed
    socket.onclose = (event) => {
        console.log("Disconnected from WebSocket server", event);
        addMessage(
            "System",
            `Disconnected from chat. Code: ${event.code}, Reason: ${event.reason}`,
            "received"
        );
    };

    // Error handling
    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        addMessage("System", "Connection error", "received");
    };

    // Send message function
    function sendMessage() {
        const message = messageInput.value.trim();
        if (message && socket.readyState === WebSocket.OPEN) {
            socket.send(message);
            addMessage("You", message, "sent");
            messageInput.value = "";
        }
    }

    // Helper function to add messages to UI
    function addMessage(sender, content, type) {
        const messageElement = document.createElement("div");
        messageElement.className = `message ${type}`;

        messageElement.innerHTML = `
            <p>${sender}: ${content}</p>
            <span>${new Date().toLocaleTimeString()}</span>
        `;

        messagesContainer.appendChild(messageElement);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    // Event listeners
    sendButton.addEventListener("click", sendMessage);
    messageInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            sendMessage();
        }
    });
});
