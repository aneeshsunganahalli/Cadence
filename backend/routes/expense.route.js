import express from "express";
import { addExpense, getExpenses } from "../controllers/expense.controller.js";
import authUser from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", authUser, addExpense);
router.get("/", authUser, getExpenses);

export default router;
