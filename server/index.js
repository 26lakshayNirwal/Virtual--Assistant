import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRouter from './routes/userRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import routerUser from './routes/user.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true // Allow credentials to be sent with requests
}));

const port = process.env.PORT || 3001;
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth",userRouter);
app.use("/api/user",routerUser);


app.listen(port, () => {
    connectDB();
  console.log(`Server running on port ${port}`);
});