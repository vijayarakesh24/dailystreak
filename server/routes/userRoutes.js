import express from "express";
import { register, login } from "../controllers/authController.js";
import { visitUser, getLeaderboard, takePledge, getCurrentUser } from "../controllers/userController.js";
import { authenticateToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

// Remove username param, use auth token
router.post("/visit", authenticateToken, visitUser);
router.post("/pledge", authenticateToken, takePledge);
router.get("/me", authenticateToken, getCurrentUser);
router.get("/leaderboard", getLeaderboard);

export default router;
