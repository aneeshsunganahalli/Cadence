import express from "express";
import { addDeposit, deleteDeposit, getDeposits, updateDeposit } from "../controllers/deposit.controller.js";
import authUser from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", authUser, addDeposit);
router.get("/", authUser, getDeposits);
router.delete("/delete/:id", authUser, deleteDeposit);
router.patch("/update/:id", authUser, updateDeposit);

export default router;
