import Deposit from "../models/deposit.model.js";

const addDeposit = async (req, res) => {
  try {

    const { userId, amount, depositType , description } = req.body;

    const depositData = {
      userId,
      amount,
      depositType,
      description,
      date: Date.now(),
    }

    const newDeposit = new Deposit(depositData);
    await newDeposit.save();

    res.status(201).json({ success: true, message: "Deposit Added" })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};


const getDeposits = async (req, res) => {
  try {
    const { userId } = req.body;
    const deposits = await Deposit.find({ userId: userId }).sort({ date: -1 });

    res.status(200).json({ deposits });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const deleteDeposit = async (req, res) => {
  try {
    const { userId } = req.body;
    const deposit = await Deposit.findById(req.params.id);
    const depositUserId = deposit.userId.toString(); // Convertd ObjectId to String for comparison

    if (!deposit) {
      return res.status(404).json({ success: false, message: "Deposit Not Found" });
    }

    if (userId !== depositUserId) {
      return res.status(401).json({ success: false, message: "You can only delete your own deposit" });
    }

    await Deposit.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Deposit Deleted Successfully" });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

const updateDeposit = async (req, res) => {
  try {
    const { userId, amount, depositType, description } = req.body;
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({ success: false, message: "Deposit not found" });
    }

    if (userId !== deposit.userId.toString()) {
      return res.status(401).json({ success: false, message: "You can only update your own deposits" });
    }

    if (!amount && !depositType && !description) {
      return res.status(400).json({ success: false, message: "At least one field is required" });
    }

    const updatedDeposit = await Deposit.findByIdAndUpdate(
      req.params.id,
      {
        amount: amount || deposit.amount,
        depositType: depositType || deposit.depositType,
        description: description || deposit.description
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: "Deposit Updated", deposit: updatedDeposit });

  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
}

export {addDeposit, getDeposits, deleteDeposit, updateDeposit};