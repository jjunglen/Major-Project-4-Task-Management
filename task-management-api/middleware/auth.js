const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    // Extract from bear token
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ 
            error: "Access token required"
        });
    }

    try {
        // Verify token with jwt.verify();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();

    } catch(error) {
        return res.status(401).json({ error: "Invalid or expired token. Please log in again."})
    }
};

const requireAdmin = (req, res, next) => {
    if (req.user.role !== "admin") {
        return res.status(403).json({ error: "Accessed denied. Admins access only!"});
    }
    next();
}

module.exports = { authenticateToken, requireAdmin };
