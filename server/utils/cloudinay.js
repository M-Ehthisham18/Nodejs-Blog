require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



// Upload an image
const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null ;
    
    //upload file on cloudinary
    const response = await cloudinary.uploader.upload(
      localFilePath, {
        resource_type : "auto"
      }
    )
    console.log(`file uplaoded on cloudinary. file src : ${response.url}`);
    //once the file is uploaded ,we would like to delete it from our server
    fs.unlinkSync(localFilePath)
    return response;

  } catch (error) {
    console.log("Error on cloudinary : ",error)
    fs.unlinkSync(localFilePath)
    return null;
  }
}

// delete file from cloudinary in case of failed to createUser
const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId)
    console.log("Delete from cloudinary. public Id : ",publicId);
    
  } catch (error) {
    console.log("error deleting from cloudinary :",error);
    return null;
    
  }
}


module.exports = {uploadOnCloudinary,deleteFromCloudinary};
