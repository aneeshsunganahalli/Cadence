import express from "express";
import { addExpense, deleteExpense, getExpenses, updateExpense } from "../controllers/expense.controller.js";
import authUser from "../middleware/userAuth.js";

const router = express.Router();

router.post("/add", authUser, addExpense);
router.get("/get", authUser, getExpenses);
router.delete("/delete/:id", authUser, deleteExpense);
router.patch("/update/:id", authUser, updateExpense);

export default router;
