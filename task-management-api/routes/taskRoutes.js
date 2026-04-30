const express = require("express");
const router = express.Router();
const { authenticateToken } = require("../middleware/auth");

let tasks = [];
let users = [];
let nextTaskId;

const setTasks = (task, idCounter) => {
    tasks = task;
    nextTaskId = idCounter;
};

const setUsers = (user) => {
    users = user;
};

// GET /api/tasks - get user's own tasks
router.get("/", authenticateToken, (req, res) => {
    const userTasks = tasks.filter(task => task.userId === req.user.userId);
    
    // return users tasks only
    res.json(userTasks);
})

// POST /api/tasks - create a task
router.post("/", authenticateToken, (req, res, next) => {
    try {
        const { title, description, status } = req.body;

        // Validate fields
        if (!title || !description || !status) {
            return res.status(400).json({ error: "Title, description, and status are all required."});
        }

        const validStatus = ["todo", "in-progress", "completed"];
        if (!validStatus.includes(status)) {
            return res.status(400).json({ error: "Status must be todo, completed, or in-progress."});
        } 

        // Create new task
        const newTask = {
            id: nextTaskId++,
            title,
            description,
            status,
            userId: req.user.userId,
            createdAt: new Date(),
            updatedAt: new Date(),
        };

        tasks.push(newTask)

        res.status(201).json(newTask);

    } catch(error) {
        next(error);
    }
});

// PUT /api/tasks/:id - update own task
router.put("/:id", authenticateToken, (req, res, next) => {
    try {
        const taskId = parseInt(req.params.id);
        const task = tasks.find(task => task.id === taskId);

        if (!task) {
            return res.status(404).json({ error: "Task not found!"});
        }

        if (task.userId !== req.user.userId) {
            return res.status(403).json({ error: "Access denied!"});
        }

        const { title, description, status } = req.body;


        if (title && (title.length < 3 || title.length > 100)) {
            return res.status(400).json({ error: "Title must be 3-100 characters long."});
        }

        if (description.length < 10 && description) {
            return res.status(400).json({ error: "Descriptions must be at least 10 characters long."})
        }
        
        // validate status
        const validStatus = ["todo", "in-progress", "completed"];
        if (status && !validStatus.includes(status)) {
            return res.status(400).json({ error: "Statust must be todo, complete, or in-progress"})
        }

        // Update fields
        if (title) {
            task.title = title;
        }

        if (description) {
            task.description = description;
        }
            
        if (status) {
            task.status = status;
        }

        task.updatedAt = new Date();

        res.json(task);
    } catch(error) {
        next(error);
    }
});

router.delete("/:id", authenticateToken, (req, res, next) => {
    try {
        const taskId = parseInt(req.params.id);
        const taskIndex = tasks.findIndex(task => task.id === taskId);

        if (taskIndex === -1) {
            return res.status(404).json({ error: "Task not found." });
        }

        if (tasks[taskIndex].userId !== req.user.userId) {
            return res.status(403).json({ error: "Access denied. You can only delete your posts"});
        }

        const deletedTask = tasks.splice(taskIndex, 1)[0];
        res.json({ 
            message: "Task deleted successfully",
            task: deletedTask,
        });
    } catch(error) {
        next(error);
    }
});

module.exports = { router, setTasks, setUsers};

