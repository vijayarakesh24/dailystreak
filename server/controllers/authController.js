import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    const { username, password, avatar, color } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            username,
            password: hashedPassword,
            avatar: avatar || username[0].toUpperCase(),
            color: color || "from-rose-400 to-pink-500"
        });

        await user.save();
        res.status(201).json({ message: "User created" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "User not found" });

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(400).json({ message: "Invalid password" });

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.JWT_SECRET || "secret", { expiresIn: "1h" });

        // Return user info along with token so frontend can display immediate info
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username,
                avatar: user.avatar,
                color: user.color,
                currentStreak: user.currentStreak
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
