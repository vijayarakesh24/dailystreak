import User from "../models/User.js";
import { isSameDay, isYesterday } from "../utils/dateUtils.js";

export const visitUser = async (req, res) => {
  const userId = req.user.id; // From authMiddleware
  const today = new Date();

  let user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Block second click on same day
  if (user.lastVisit && isSameDay(user.lastVisit, today)) {
    return res.status(403).json({
      message: "Already clicked today",
      currentStreak: user.currentStreak
    });
  }

  // Streak logic
  if (user.lastVisit && isYesterday(user.lastVisit)) {
    user.currentStreak += 1;
  } else {
    // If it's not yesterday (and not today, checked above), it means they missed a day or it's first visit
    user.currentStreak = 1;
  }

  user.lastVisit = today;
  user.history.push(today);
  await user.save();

  res.json({
    message: "Click counted",
    currentStreak: user.currentStreak
  });
};

export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const takePledge = async (req, res) => {
  const userId = req.user.id;
  await User.findByIdAndUpdate(userId, { hasPledged: true });
  res.json({ message: "Pledge accepted" });
};

export const getLeaderboard = async (req, res) => {
  const users = await User.find()
    .sort({ currentStreak: -1, lastVisit: 1 })
    .select("username currentStreak");

  res.json(users);
};
