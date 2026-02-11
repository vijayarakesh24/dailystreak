import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "A"
  },
  color: {
    type: String,
    default: "from-rose-400 to-pink-500"
  },
  hasPledged: {
    type: Boolean,
    default: false
  },
  history: [{
    type: Date
  }],
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
