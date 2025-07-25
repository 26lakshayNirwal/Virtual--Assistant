import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (filePath) => {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath); // Delete the file after upload
        return uploadResult.secure_url;


    } catch (error) {
        fs.unlinkSync(filePath); // Delete the file even if upload fails
        return res.status(500).json({ message: 'File upload failed', error: error.message });
    }
}
export default uploadOnCloudinary;