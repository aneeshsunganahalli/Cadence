import express from "express";
import dotenv from "dotenv";
import cors from "cors"
import mongoose from "mongoose";
import userRouter from "./routes/user.route.js";
import expenseRouter from "./routes/expense.route.js";

dotenv.config();
mongoose.connect(process.env.MONGO).then(() => {
  console.log("Database Connected")
}).catch((err) => {
  console.log(err)
})

const app = express();
const port = 5000

app.use(cors());
app.use(express.json());


app.use("/api/user", userRouter);
app.use("/api/expenses", expenseRouter);

app.get('/', (req,res) => {
  res.send('API WORKING')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})