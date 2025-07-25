import genToken from '../config/token.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';


export const signUp = async (req, res) => {
    
    try {
        const { name, email, password } = req.body;
        //console.log(req.body);
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        
        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        const hashedPassword= await bcrypt.hash(password, 10);

        const user = await User.create({
            name,password: hashedPassword, email
        });

        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
        });

         return res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: `sign up errror ${error}` });
    }   
}

export const login = async (req, res) => {
    
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "email does not exists !" });
        }
        
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid password" });
        }
       
        const token = await genToken(user._id);

        res.cookie("token", token, {
            httpOnly: true,
            secure: true, // Set to true if using HTTPS
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
        });

         return res.status(200).json(user);
    }
    catch (error) {
        return res.status(500).json({ message: `Login errror ${error}` });
    }   
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        return res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        return res.status(500).json({ message: `Logout error ${error}` });
    }
}

