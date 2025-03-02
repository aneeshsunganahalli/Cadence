import express from "express";
import { addExpense, deleteExpense, getExpense, getExpenses, updateExpense } from "../controllers/expense.controller.js";
import authUser from "../middleware/userAuth.js";

const router = express.Router();

router.post("/", authUser, addExpense);
router.get("/", authUser, getExpenses);
router.get("/:id", authUser, getExpense);
router.delete("/delete/:id", authUser, deleteExpense);
router.patch("/update/:id", authUser, updateExpense);

export default router;
