import validator from "validator";
import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body

    if (!username || !email || !password)
      return res.json({ success: false, message: "Missing Credentials" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Enter a valid email" });

    if (password.length() < 8)
      return res.json({ success: false, message: "Enter a strong password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userInfo = {
      username,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userInfo);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ success: true, token })

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })

  }
}

export {registerUser};