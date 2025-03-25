const jwt = require("jsonwebtoken");

function authenticate(req, res, next) {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).redirect("/login");
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = { authenticate };
