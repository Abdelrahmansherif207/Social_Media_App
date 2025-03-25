# WebSocket Chat Application

![Project Screenshot](https://via.placeholder.com/800x400?text=WebSocket+Chat+App) <!-- Replace with actual screenshot -->

A real-time chat application built with Node.js, Express, MongoDB, and WebSocket technology featuring authentication and post creation.

## ✨ Features

- 🔒 JWT Authentication (Register/Login/Logout)
- 💬 Real-time chat using WebSocket
- 📝 Create and view posts
- 🍪 Cookie-based sessions
- 🗃️ MongoDB data persistence
- 📱 Responsive UI

## 🛠️ Tech Stack

**Frontend:**  
![EJS](https://img.shields.io/badge/EJS-Templating-green)
![CSS3](https://img.shields.io/badge/CSS3-Styling-blue)

**Backend:**  
![Node.js](https://img.shields.io/badge/Node.js-Runtime-green)
![Express](https://img.shields.io/badge/Express-Framework-lightgrey)

**Database:**  
![MongoDB](https://img.shields.io/badge/MongoDB-Database-green)

**Other:**  
![WebSocket](https://img.shields.io/badge/WebSocket-Real--time-yellow)
![JWT](https://img.shields.io/badge/JWT-Authentication-blue)

## 🚀 Getting Started

### Prerequisites
- Node.js (v14+)
- MongoDB Atlas account or local MongoDB instance
- Git

### Installation
1. Clone the repo
```bash
git clone https://github.com/yourusername/websocket-chat-app.git
cd websocket-chat-app
Install dependencies

bash
Copy
npm install
Set up environment variables

bash
Copy
cp .env.example .env
Edit .env with your credentials:

Copy
PORT=3000
MONGODB_URI=mongodb://localhost:27017/chat-app
JWT_SECRET=your_strong_secret_here
Start the server

bash
Copy
npm start
Open in browser

Copy
http://localhost:3000
📂 Project Structure
Copy
.
├── config/            # Configuration files
│   └── db.js          # Database connection
├── middlewares/       # Express middlewares
│   └── authenticate.js # Auth middleware
├── public/            # Static assets
│   ├── css/           # Stylesheets
│   └── js/            # Client-side scripts
├── views/             # EJS templates
│   ├── chat.ejs       # Chat interface
│   ├── login.ejs      # Login page
│   ├── posts.ejs      # Posts feed
│   └── register.ejs   # Registration page
├── app.js             # Main application
└── package.json       # Dependencies
🌟 Key Code Snippets
WebSocket Implementation
javascript
Copy
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log("New client connected");
    
    ws.on('message', (message) => {
        // Broadcast to all clients
        wss.clients.forEach(client => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });
});
JWT Authentication Middleware
javascript
Copy
const authenticate = async (req, res, next) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { email: decoded.email };
        next();
    } catch (err) {
        res.redirect('/login');
    }
};
🖼️ UI Examples
Login Page
Login Page

Posts Feed
Posts Feed

Chat Interface
Chat Interface

🔧 API Endpoints
Endpoint	Method	Description	Auth Required
/	GET	View posts	Yes
/	POST	Create post	Yes
/register	GET	Registration form	No
/register	POST	Register user	No
/login	GET	Login form	No
/login	POST	Authenticate	No
/logout	GET	Logout	Yes
/chat	GET	Chat UI	Yes
/users	GET	List users	No
🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add some amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

📜 License
Distributed under the MIT License. See LICENSE for more information.

✉️ Contact
Your Name - your.email@example.com
Project Link: https://github.com/yourusername/websocket-chat-app

🙏 Acknowledgments
WebSocket Documentation

Express.js

MongoDB Atlas
