const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login", login);

// Protected route (JWT required)
router.get("/profile", authMiddleware, (req, res) => {
  res.json({
    message: "User profile data",
    user: req.user
  });
});

module.exports = router;