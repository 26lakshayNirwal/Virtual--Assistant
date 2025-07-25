import express from 'express';
import { askToAssistant, deleteHistoryPoint, getCurrentUser, updateAssistant } from '../controllers/userController.js';
import isAuth from '../middlewares/isAuth.js';
import upload from '../middlewares/multer.js';
 

const routerUser = express.Router();


routerUser.get("/current",isAuth,getCurrentUser);
routerUser.post("/update",isAuth,upload.single('assistantImage'),updateAssistant);
routerUser.post("/ask", isAuth, askToAssistant);
routerUser.delete("/history", isAuth, deleteHistoryPoint);





export default routerUser;
