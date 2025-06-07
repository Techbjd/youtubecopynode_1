import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

// ========== Upload Function ==========
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath || !fs.existsSync(localFilePath)) {
      console.error("No file found at path:", localFilePath);
      return null;
    }
   

    // Upload file
    const result = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // Remove local file
    fs.unlinkSync(localFilePath);
    console.log(" File uploaded to Cloudinary:", result.secure_url);
    return result;
  } catch (error) {
    console.error(" Cloudinary Upload Error:", error);

    // Attempt to delete the temp file even on error
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (err) {
      console.error("⚠ Failed to delete temp file:", err);
    }

    return null;
  }
};

// ========== Delete Function ==========
const deleteFromCloudinary = async (publicId) => {
  try {
    if (!publicId) {
      console.error("No public ID provided for deletion.");
      return null;
    }

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("🗑 File deleted from Cloudinary:", publicId);
    return result;
  } catch (error) {
    console.error(" Cloudinary Deletion Error:", error);
    return null;
  }
};
export { uploadOnCloudinary, deleteFromCloudinary };


































// import { v2 as cloudinary } from 'cloudinary';
// import fs from 'fs';
// import dotenv from "dotenv"
// dotenv.config()
// // Configuration
// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key: process.env.CLOUDINARY_CLOUD_KEY,
//     api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
// });

// // Function to upload a file to Cloudinary
// const uploadOnCloudinary = async (localFilePath) => {
//     try {
//         console.log("cloudinary.config:",{
//             cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//             api_key: process.env.CLOUDINARY_CLOUD_KEY,
//             api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
//         });
//         if (!localFilePath) return null;
//         const response = await cloudinary.uploader.upload(localFilePath, {
//             resource_type: 'auto',
//         });
//         console.log('File uploaded on Cloudinary > File src: ' + response.url);
//         // If file is uploaded, delete it from the server
//         fs.unlinkSync(localFilePath);
//         return response;
//     } catch (error) {
//         console.error('Error uploading to Cloudinary:', error);
//         await fs.promises.unlink(localFilePath);

//         return null;
//     }
// };
// const deleteFromCloudinary=async (publicId)=>{
//     try {
//      const result=await cloudinary.uploader.destroy(publicId)   
//      console.log("Deleting from cloudinary. Public id",publicId)
//     } catch (error) {
//         console.log("error deleting from cloudinary",error)
// return null
//     }
// }

// // Export the function
// export { uploadOnCloudinary,deleteFromCloudinary };
