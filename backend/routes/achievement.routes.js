const express = require("express");
const router = express.Router();
const { authenticate, authorize } = require("../middleware/auth.middleware");
const achievementController = require("../controllers/achievement.controller");

// Public routes
router.get("/categories", achievementController.getCategories);
router.get("/leaderboard", achievementController.getLeaderboard);

// Student routes
router.post("/", authenticate, authorize('student'), achievementController.createAchievement);
router.get("/mine", authenticate, authorize('student'), achievementController.getMyAchievements);
router.get("/analytics", authenticate, authorize('student'), achievementController.getAnalytics);

// Admin routes
router.get("/pending", authenticate, authorize('admin'), achievementController.getPendingAchievements);
router.put("/verify/:id", authenticate, authorize('admin'), achievementController.verifyAchievement);

module.exports = router;
