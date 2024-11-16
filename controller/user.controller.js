import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

// Register User
const registerApi = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        // Validate role
        if (!["manager", "team-lead", "developer", "tester"].includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }
        

        // Check for existing user
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(403).json({ message: "User email already exists" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const newUser = new User({ username, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: `Welcome, ${newUser.username}!` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Login User
const loginApi = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User email does not exist" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, { expiresIn: "1h" });
        res.json({ token, message: "Login successful" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Authentication failed" });
    }
};

export default { registerApi, loginApi };
