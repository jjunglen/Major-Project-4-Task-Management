const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("../middleware/auth");


let users = [];
let nextUserId;
const setUsers = (user, idCounter) => {
    users = user;
    nextUserId = idCounter;
};

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
    try {
        const { username, email, password } = req.body;

        // validate inputs
        if (!username || !email || !password) {
            return res.status(400).json({ error: "Email, password, and username are required"})
        }

        if (username.length < 3 || username.length > 20) {
            return res.status(400).json({ error: "Username must be 3-20 characters long."});
        }

        if (password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long"});
        }

        // check if email exists
        const existingEmail = users.find(user => user.email === email);
        if (existingEmail) {
            return res.status(400).json({ error: "Email already exists."});
        }

        // Hash password
        const hashPassword = await bcrypt.hash(password, 10);

        // Create user object with unique ID
        const newUser = {
            id: nextUserId++,
            username,
            email,
            password: hashPassword,
            role: "user",
            createdAt: new Date()
        };
        users.push(newUser);
        
        // Generate jwt token
        const token = jwt.sign(
            {
                userId: newUser.id,
                role: newUser.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        res.status(201).json({
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role
            }
        })
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
    try {
        // validate email and password provided
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password required." });
        }

        // Find user by email
        const userEmail = users.find(user => user.email === email);
        if (!userEmail) {
            return res.status(401).json({ error: "Invalid credentials."})
        };

        // Compare password with bcrypt.compare()
        const comparePassword = await bcrypt.compare(password, userEmail.password);
        if (!comparePassword) {
            return res.status(401).json({ error: "Invalid password."})
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                userId: userEmail.id,
                role: userEmail.role,
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // return token, user
        res.status(201).json({
            token,
            user: {
                id: userEmail.id,
                username: userEmail.username,
                email: userEmail.email,
                role: userEmail.role
            }
        })

    } catch(error) {
        next(error);
    }
});

// GET /api/auth/me
router.get("/me", authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.userId);
    if (!user) {
        return res.status(404).json({ error: "User not found." });
    }
    res.json({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
    });
})

module.exports = { router, setUsers };