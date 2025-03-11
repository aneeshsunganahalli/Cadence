import Expense from "../models/expenses.model.js";

const addExpense = async (req, res) => {
  try {

    const { userId, amount, category, description, paymentMethod, date } = req.body;

    const expenseData = {
      userId,
      amount,
      category,
      description,
      paymentMethod,
      date: date ? new Date(date) : Date.now(),
    }

    const newExpense = new Expense(expenseData);
    await newExpense.save();

    res.status(201).json({ success: true, message: "Expense Added" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// To get all expenses
const getExpenses = async (req, res) => {
  try {
    const { userId } = req.body;
    const expenses = await Expense.find({ userId: userId }).sort({ date: -1 });

    res.status(200).json({ success:true, expenses });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

//To get a single expense
const getExpense = async (req,res) => {
  try {
    
    const expense = await Expense.findById(req.params.id);
    res.status(200).json({success: true, expense});

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
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
    res.status(500).json({ success: false, message: error.message });
  }
}

const updateExpense = async (req, res) => {
  try {
    const { userId, amount, category, description, paymentMethod } = req.body;
    const expense = await Expense.findById(req.params.id);

    if (!expense) {
      return res.status(404).json({ success: false, message: "Expense not found" });
    }

    if (userId !== expense.userId.toString()) {
      return res.status(401).json({ success: false, message: "You can only update your own expenses" });
    }

    if (!amount && !category && !description && !paymentMethod) {
      return res.status(400).json({ success: false, message: "At least one field is required" });
    }

    const updatedExpense = await Expense.findByIdAndUpdate(
      req.params.id,
      {
        amount: amount || expense.amount,
        category: category || expense.category,
        description: description || expense.description,
        paymentMethod: paymentMethod || expense.paymentMethod
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Expense Updated", expense: updatedExpense });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}


export { addExpense, getExpenses, deleteExpense, updateExpense, getExpense };