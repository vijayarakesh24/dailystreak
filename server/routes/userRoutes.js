import express from "express";
import { visitUser, getLeaderboard } from "../controllers/userController.js";

const router = express.Router();

router.post("/visit/:username", visitUser);
router.get("/leaderboard", getLeaderboard);

export default router;
