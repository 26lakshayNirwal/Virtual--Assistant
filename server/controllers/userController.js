import User from '../models/userModel.js';
import  uploadOnCloudinary  from '../config/cloudinary.js';
import geminiResponse from '../gemini.js';
import { response } from 'express';
import moment from 'moment/moment.js';

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from the request object set by isAuth middleware
        const user = await User.findById(userId).select('-password'); // Exclude password from the response
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    
    } catch (error) {
        return res.status(500).json({ message: 'Server error', error: error.message });
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, imageUrl } = req.body;
        let assistantImage;

        if (req.file) {
            const uploaded = await uploadOnCloudinary(req.file.path);
            assistantImage = uploaded;
        } else if (imageUrl && imageUrl !== "undefined") {
            assistantImage = imageUrl;
        }

        

        const user = await User.findByIdAndUpdate(
            req.userId,
            {
                assistantImage,assistantName
            },
            { new: true }
        ).select('-password');

        return res.status(200).json({
            message: 'Assistant updated successfully',
            user
        });

    } catch (error) {
        return res.status(500).json({ message: 'Update Assistant Error', error: error.message });
    }
}

export const askToAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await User.findById(req.userId);
        user.history.push(command);
        user.save();
        const userName = user.name;
        const assistantName = user.assistantName;
        const result = await geminiResponse(command, assistantName, userName);
        //console.log(result);

        const jsonMatch = result.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ response: "Sorry, I can't understand" });
        }

        const gemResult = JSON.parse(jsonMatch[0]);
        const type = gemResult.type;

        switch (type){
            case 'get_date':
                return res.status(200).json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today's date is ${moment().format('YYYY-MM-DD')}`,
                
                });
           case 'get_time':
                return res.status(200).json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current time is ${moment().format('HH:mm A')}`,
                });
            case 'get_day':
                return res.status(200).json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Today is ${moment().format('dddd')}`,
                });
            case 'get_month':
                return res.status(200).json({
                    type,
                    userInput: gemResult.userInput,
                    response: `Current month is ${moment().format('MMMM')}`,
                });
            default:
                return res.json({
                    type,
                    userInput: gemResult.userInput,
                    response: gemResult.response
                });     
        }


    } catch (error) {
        return res.status(500).json({ response: 'Error processing request', error: error.message });
    }
}

export const deleteHistoryPoint = async (req, res) => {
  try {
    const userId = req.userId;
    const { index } = req.body;

    const user = await User.findById(userId);

    if (!user || !user.history) {
      return res.status(404).json({ message: "User or history not found" });
    }

    if (index < 0 || index >= user.history.length) {
      return res.status(400).json({ message: "Invalid index" });
    }

    user.history.splice(index, 1);
    await user.save();

    res.status(200).json({ message: "History item deleted", history: user.history });
  } catch (error) {
    console.error("Error deleting history item:", error);
    res.status(500).json({ message: "Server error" });
  }
};






