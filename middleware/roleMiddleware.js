import jwt from "jsonwebtoken";
const isRole = (allowedRoles) => (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1]; // Extract token from header

    if (!token) {
        return res.status(401).json({ message: "Access denied: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY); // Verify token
        req.user = decoded; // Attach user data to the request object

        if (!allowedRoles.includes(decoded.role)) {
            return res.status(403).json({ message: "Access denied: Insufficient privileges" });
        }

        next(); // Proceed to the next middleware or controller
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        res.status(500).json({ message: "Failed to authenticate token. Try again later." });
    }
};
export default isRole;
