const express = require("express");
const router = express.Router();
const { authenticateToken, requireAdmin } = require("../middleware/auth");

let tasks;
let users;

const setTasks = (task) => {
    tasks = task;
}

const setUsers = (user) => {
    users = user;
}

// GET /api/admin/tasks - view all tasks
router.get("/tasks", authenticateToken, requireAdmin, (req, res) => {
    const tasksOwner = tasks.map(task => {
        const owner = users.find(user => user.id === task.userId);
        return {
            ...task,
            owner: owner ? {
                id: owner.id,
                username: owner.username,
                email: owner.email,
            } : null
        };
    });

    res.json(tasksOwner);
});

module.exports = { router, setTasks, setUsers };

