import user from "../model/user.model.js";
import bcrypt from "bcrypt";

const registerApi = async (req, res) => {
    try{
        const {username, email, password, address} = req.body;
        const existingUser = await user.findOne({ email });

        if(existingUser){
            return res.status(400).json({ message: "User email already exist" });
        }
        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);
        const userData = new user({
            username,
            email,
            password: hashedPassword,
            address
        });
        await userData.save();
        res.status(201).json({ message: `Welcome, ${userData.username}! you seccessfully registered in our portal` });
    }catch(err){
        res.status(500).json({ message: `Internal Server error,${err.message}` });
    }
}

export default {registerApi};