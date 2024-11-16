import user from "../model/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY;

const registerApi = async (req, res) => {
    try {
        const { username, email, password, role } = req.body;
        const existingUser = await user.findOne({ email });

        if (existingUser) {
            return res.status(403).json({ message: "User email already exist" });
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = new user({
            username,
            email,
            password: hashedPassword,
            role
        });
        await userData.save();
        res.status(201).json({ message: `Welcome! ${userData.username}, user profile created`});
    } catch (err) {
        res.status(500).json({ message: `Internal Server error,${err.message}` });
    }
}

const loginApi = async (req, res) => {
    try {
        const { email, password } = req.body;
        const registeredUser = await user.findOne({ email });
        if (!registeredUser) {
            return res.status(404).json({ message: "User mail doesn't exist" });
        };
        const passwordMatch = await bcrypt.compare(password, registeredUser.password);
        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const token = jwt.sign({ userId: registeredUser._id, role: registeredUser.role }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token: token, message: "Login successful" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Authentication failed" });
    }
};


export default { registerApi, loginApi};