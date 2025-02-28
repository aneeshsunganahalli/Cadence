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

    res.json({ success: true, message: "Expense Added" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

export { addExpense };