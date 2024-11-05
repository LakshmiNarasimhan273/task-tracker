import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const isRole = (allowedRole) => (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token){
        return res.json(401).json({message: "No token! Access denied"});
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        if(!allowedRole.includes(decoded.role)){
            return res.status(401).json({ message: "Access denind" });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: "Couldn't authenticate you right now, please try some other time" });
    }
}

export default isRole;