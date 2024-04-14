import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        const result = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'auto'
        });

        // console.log("File Uploaded:", result);
        // console.log("File URL:", result.url);
        fs.unlinkSync(localFilePath);
        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        // Delete the local file if it exists
        fs.unlinkSync(localFilePath)

        return null;
    }
};

export { uploadOnCloudinary };
