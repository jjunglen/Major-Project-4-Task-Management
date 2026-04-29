// Load dotenv
require("dotenv").config();
// IMport required packages
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Create express app
const app = express();

// Apply middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Set up rate limiting for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 25,
    message: { error: "Too many request, please try again in 15 minutes"},
});
app.use("/api/auth", authLimiter);

// In-memory data storage
let users = [];
let tasks = [];
let nextUserId = 1;
let nextTaskId = 1;
const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASSWORD, 10);
const email = process.env.EMAIL;

users.push({
    id: nextUserId ++,
    username: "admin",
    email: email,
    password: adminPassword,
    role: "admin",
    createdAt: new Date(),
})

// Get root route
app.get("/", (req, res) => {
    res.json({ message: "Task Management API",});
});

// Server listening port
const PORT = process.env.PORT || 3001;

// Basic error handling
app.use((req, res) => {
    res.status(404).json({ error: "Route not found"});
});

app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).json({ error: "Something went wrong on our end. Please try again later"});
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
