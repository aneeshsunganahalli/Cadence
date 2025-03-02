import validator from "validator";
import bcrypt from "bcryptjs"
import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  try {

    const { username, email, password } = req.body;

    if (!username || !email || !password)
      return res.json({ success: false, message: "Missing Credentials" });

    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Enter a valid email" });

    if (password.length < 8)
      return res.json({ success: false, message: "Enter a strong password" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userInfo = {
      username,
      email,
      password: hashedPassword,
    };

    const newUser = new User(userInfo);
    const client = await newUser.save();

    const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message })

  }
}

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await User.findOne({ email });

    if (!client)
      return res.status(404).json({ success: false, message: "User not found" });

    const passwordMatch = bcrypt.compare(password, client.password)

    if (passwordMatch) {
      const token = jwt.sign({ id: client._id }, process.env.JWT_SECRET);
      return res.json({ success: true, token });
    } else {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}


const updateUserName = async (req,res) => {
  try {
    const {userId, username} = req.body;
    const client = await User.findById(userId);

    if(!client) {
      return res.json({success: false, message: "User Not Found"});
    }

    const updatedClient = await User.findByIdAndUpdate(userId,{
      username: username || client.username
    }, {new: true});

    res.json({success: true, message: "Profile Updated", updatedClient});
    
  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
}

const googleAuth = async (req,res) => {
  try {
    const user = await User.findOne({email: req.body.email});
    if (user) {
      const token = jwt.sign({id: user._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = user._doc;

      res.status(200).json({success: true, token});
    } else {
      const generatedPassword = Math.random().toString(36).substring(-8) + Math.random().toString(36).substring(-8);
      const salt = await bcrypt.genSalt(10);
      
      const hashedPassword = await bcrypt.hash(generatedPassword, salt);

      const newUser = new User({
        username: req.body.name.split(' ').join('').toLowerCase() + Math.random().toString(36).substring(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo
      });

      await newUser.save();
      const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET);
      const {password: pass, ...rest} = newUser._doc;
      res.status(200).json({success: true, token});
    }

  } catch (error) {
    console.log(error);
    res.json({success: false, message: error.message});
  }
}

export { registerUser, loginUser, updateUserName, googleAuth };