import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: "",
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
}, { minimize: false });

const Expense = mongoose.model("Expense", expenseSchema)

export default Expense;