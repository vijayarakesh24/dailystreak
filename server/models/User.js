import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  lastVisit: {
    type: Date,
    default: null
  }
});

export default mongoose.model("User", userSchema);
