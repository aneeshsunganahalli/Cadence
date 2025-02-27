import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import mongoose from "mongoose";

dotenv.config();
mongoose.connect(process.env.MONGO).then(() => {
  console.log("Database Connected")
}).catch((err) => {
  console.log(err)
})

const app = express();
const port = 5000

app.use(cors())
app.use(express.json())

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
}
)