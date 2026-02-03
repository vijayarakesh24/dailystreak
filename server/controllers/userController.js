import User from "../models/User.js";
import { isSameDay, isYesterday } from "../utils/dateUtils.js";

export const visitUser = async (req, res) => {
  const { username } = req.params;
  const today = new Date();

  let user = await User.findOne({ username });

  // Auto-create user
  if (!user) {
    user = new User({
      username,
      currentStreak: 1,
      lastVisit: today
    });

    await user.save();

    return res.json({
      message: "First click counted",
      currentStreak: 1
    });
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
    user.currentStreak = 1;
  }

  user.lastVisit = today;
  await user.save();

  res.json({
    message: "Click counted",
    currentStreak: user.currentStreak
  });
};

export const getLeaderboard = async (req, res) => {
  const users = await User.find()
    .sort({ currentStreak: -1, lastVisit: 1 })
    .select("username currentStreak");

  res.json(users);
};
