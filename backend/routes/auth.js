import express from "express";
import { register, login } from "../controller/users.js";

const router = express.Router();

// Authentication routes
router.post("/register", register);
router.post("/login", login);

router.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Session destroy error:", err);
      return res.status(500).json("Logout failed");
    }
    res.clearCookie("sessionId");
    res.json("Logout successful");
  });
});

router.get("/isAuthenticate", (req, res) => {
  console.log("Session ID:", req.sessionID);
  console.log("Session data:", req.session);
  console.log("User data in session:", req.session.userData);

  if (req.session.userData) {
    return res.json({ valid: true, user: req.session.userData });
  } else {
    return res.json({ valid: false });
  }
});

export default router;
