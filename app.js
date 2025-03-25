require("dotenv").config();
const express = require("express");
const app = express();
const { connectToDB } = require("./config/db");
const PORT = process.env.PORT;
const bcrypt = require("bcrypt");
const { authenticate } = require("./middlewares");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const http = require("http");
const WebSocket = require("ws");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(cookieParser());

// Create HTTP server
const server = http.createServer(app);

// WebSocket Server
const wss = new WebSocket.Server({ server });

wss.on("connection", (ws) => {
    console.log("New WebSocket client connected");

    ws.on("message", (message) => {
        // Broadcast to all clients except sender
        wss.clients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        console.log("Client disconnected");
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
    });
});

// Routes
//! GET
app.get("/", authenticate, async (req, res) => {
    const user = await app.db
        .collection("users")
        .findOne({ email: req.user.email });
    const posts = await app.db.collection("posts").find({}).toArray();
    res.render("posts", { title: "Posts", user, posts: posts });
});

app.get("/register", (req, res) => {
    res.render("register", { title: "Register" });
});

app.get("/login", (req, res) => {
    res.render("login", { title: "Login" });
});

app.get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/login");
});

app.get("/chat", authenticate, async (req, res) => {
    const user = await app.db
        .collection("users")
        .findOne({ email: req.user.email });
    res.render("chat", { title: "Chat", user });
});

app.get("/users", async (req, res) => {
    const users = await app.db.collection("users").find({}).toArray();
    res.json(users);
});

//! POST
app.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = await app.db.collection("users").findOne({ email });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = { username, email, hashedPassword };
            await app.db.collection("users").insertOne(user);
            res.redirect("/login");
        } else {
            return res.status(401).json({
                message: "This email is already registered plaese login!",
            });
        }
    } catch (error) {
        console.error("Failed to register user:", error);
        res.status(500).send("Failed to register user");
    }
});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await app.db.collection("users").findOne({ email });
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.hashedPassword
        );
        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 3600000,
            sameSite: "strict",
        });

        res.redirect("/");
    } catch (error) {
        console.error("Failed to login user:", error.message);
        res.status(500).json({ message: "Failed to login user" });
    }
});

app.post("/", authenticate, async (req, res) => {
    const { title, content } = req.body;
    const user = await app.db
        .collection("users")
        .findOne({ email: req.user.email });
    const createdAt = new Date().toLocaleString();
    const post = { title, content, createdAt, createdBy: user.username };
    await app.db.collection("posts").insertOne(post);
    res.redirect("/");
});

// Connecting to DB and App listening
connectToDB(app)
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
            // console.log(`WebSocket server running on ws://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to MongoDB:", error);
        process.exit(1);
    });

module.exports = { app, server };
