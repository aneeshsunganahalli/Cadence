import Expense from "../models/expenses.model.js";

const addExpense = async (req, res) => {
  try {

    const { userId, amount, category, description } = req.body;

    const expenseData = {
      userId,
      amount,
      category,
      description,
      date: Date.now(),
    }

    const newExpense = new Expense(expenseData);
    await newExpense.save();

    res.status(201).json({ success: true, message: "Expense Added" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const getExpenses = async (req,res) => {
  try {
    const {userId} = req.body;
    const expenses = await Expense.find({userId: userId}).sort({date: -1});

    res.status(200).json({expenses});

  } catch (error) {
    next(error);
  }
}


export { addExpense, getExpenses };