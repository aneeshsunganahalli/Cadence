import express from "express";
import { googleAuth, loginUser, registerUser, updateUserName } from "../controllers/user.controller.js";
import authUser from "../middleware/userAuth.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/update", authUser, updateUserName);
router.post("/google", googleAuth);

export default router;