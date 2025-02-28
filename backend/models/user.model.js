import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unqiue: true,
  },
  email: {
    type: String,
    required: true,
    unqiue: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: "https://cdn.vectorstock.com/i/preview-1x/26/37/profile-placeholder-image-gray-silhouette-vector-22122637.jpg"
  },
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

export default User;