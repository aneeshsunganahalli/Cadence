import mongoose from "mongoose";

const depositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  depositType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default: ""
  },
  date: {
    type: Number,
    required: true,
  }
}, { minimize: false });

const Deposit = mongoose.model("Deposit", depositSchema);

export default Deposit;