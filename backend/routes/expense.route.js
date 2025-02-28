import express from "express";
import { addExpense } from "../controllers/expense.controller.js";
import authUser from "../middleware/userAuth.js";

const router = express.Router();

router.post("/expenses", authUser, addExpense);

export default router;
