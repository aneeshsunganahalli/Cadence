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

const getExpenses = async (req, res) => {
  try {
    const { userId } = req.body;
    const expenses = await Expense.find({ userId: userId }).sort({ date: -1 });

    res.status(200).json({ expenses });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

const deleteExpense = async (req, res) => {
  try {
    const { userId } = req.body;
    const expense = await Expense.findById(req.params.id);
    const expenseUserId = expense.userId.toString(); // Convertd ObjectId to String for comparison

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense Not Found" });
    }

    if (userId !== expenseUserId) {
      return res.status(401).json({ success: false, message: "You can only delete your own expenses" });
    }

    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Expense Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


export { addExpense, getExpenses, deleteExpense };