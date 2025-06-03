import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Apierror } from "../utils/Apierror.js";
import jwt from "jsonwebtoken"
import { decode } from "punycode";
const generateAccessAndRefreshToken=async (userId)=>{
  try {
     const User= User.findById(userId)
     if(!User){
      throw new Apierror("something wrong with USer USerID in controller")
  
     }
    const accessToken= user.generateAccessToken()
    const refreshToken= user.generateRefreshToken( )
    user.refreshToken=refreshToken
    await user.save({validateBeforeSave:false})
    return{accessToken,refreshToken}
  }
  
   catch (error) {

    throw new Apierror(500,"error in access and refresh tokens")
  }}


const registerUser = asyncHandler(async (req, res) => {
    const { fullname,username, email,  password } = req.body;

    // Validation
    if (!fullname?.trim() ||  !username?.trim() ||!email?.trim() || !password?.trim()) {
         throw new Apierror(400, "All fields are required");
    }

    if (Object.keys(req.body).length === 0) {
        throw new Apierror(400, "Request body is empty");
    }

    const existedUser = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (existedUser) {
        throw new Apierror(400, "User with the given username or email already exists");
    }

    console.warn(req.files);

    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    const coverLocalPath = req.files?.coverImage?.[0]?.path;

    if (!avatarLocalPath) {
        throw new Apierror(400, "Avatar image file is missing");
    }

    let avatar;
    let coverImage;

    try {
        avatar = await uploadOnCloudinary(avatarLocalPath);
        console.log("Uploaded avatar:", avatar);

    } catch (error) {
        console.error("Error uploading avatar:", error);
        throw new Apierror(500, "Failed to upload avatar image");
    }

    if (coverLocalPath) {
        try {
            coverImage = await uploadOnCloudinary(coverLocalPath);
            console.log("Uploaded cover image:", coverImage);
        } catch (error) {
            console.error("Error uploading cover image:", error);
            throw new Apierror(500, "Failed to upload cover image");
        }
    }

   try {
     const user = await User.create({
         fullname,
         avatar: avatar.url,
         coverImage: coverImage?.url || "",
         email,
         password,
         username: username.toLowerCase(),
     });
//  await user.save();
     const createdUser = await User.findById(user._id).select("-password -refreshToken");
 
     if (!createdUser) {
         throw new Apierror(500, "An error occurred while registering the user");
     }
 
     return res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully"));
   } catch (error) {
    if(avatar){
        await deleteFromCloudinary(avatar.public_id)
    }
    if(coverImage){
        await deleteFromCloudinary(coverImage.public_id)
    }
    throw new Apierror(500, "An error occurred while registering the user and images were deleted");
   }
});
const LoginUser=asyncHandler(async (req,res)=>{
    //get data from body
    const{username,email,password}=req.body
    //validate
    if(!email){
        throw new Apierror(400,"Email is required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }],
    });
    if(!user){
        throw new Apierror(404,"User not found")
    }
    //validate password
   const isPasswordValid= await user.passswordCorrect(password)
   if(!isPasswordValid){
    throw new Apierror(404," wrong password")
   }
   const {accessToken,refreshToken}=await generateAccessAndRefreshToken(user._id)
   const loggedUser=await User.findById(user._id).select("-password -refreshToken");
   if(!loggedUser){
    throw new Apierror(404,"logged user not found")
   }
   const option={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production"
   }
   return res.status(200)
   .cookie("accessTken",accessToken,option)
   .cookie("refreshToken",refreshToken,option)
   .json(new ApiResponse(200, { user: loggedUser, accessToken, refreshToken }, "User logged in successfully"));
});
const LogoutUser=asyncHandler(async (req,res)=>{
    await User.findByIdAndUpdate(
        //neeed to do workin middleware
         req.user._id,{
            $set:{
                refreshToken:undefined,

            }
         },
         {new:true}
    )
const options={
    httpOnly:true,
    secure:process.env.NODE_ENV==="product",
}

return res
.status(200)
.clearCookie("acessTOken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200,{},"user logged out sucessfully"))

})
const refreshAcessToken=asyncHandler(async(req,res)=>{
    const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
    if(!incomingRefreshToken){
        throw new Apierror(401,"refresh Token error it is required")
    }

try {
    jwt.verify(
        incomingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET
    )
   const user= await User.findById(decodeToken?._id)
   if(!user){
    throw new Apierror(401,"invalid refresh token")
   }
if(incomingRefreshToken!==user?.refreshToken){
    throw new Apierror(401,",invalid refreshtoken from database")
}

const options={
    httpOnly:true,
    secure:process.env.NODE_ENV==="production",
}
const{accessToken,refreshToken:newRefreshToken}=await generateAccessAndRefreshToken(user._id)
return res.status(200).cookie("accessToken",accessToken,options)
.cookie("refreshToken",newRefreshToken,options)
.json( 
    new ApiResponse(
        200,
    { 
        accessToken,refreshToken:newRefreshToken},
     "Acess token refreshed sucessfully"
        
    ))

}

 catch (error) {
throw new Apierror(500,"something went wrong while refresh access token")
}  



})



const changeCurrentPassword=asyncHandler(async(req,res)=>{
const{oldPassword,newPassword}=req.body
const user=await User.findById(req.user?._id)
    const isPasswordValid=await user.ispassswordCorrect(oldPassword)
if(!isPasswordValid){
    throw new Apierror(401,"old password is incorrect")
}
user.password=newPassword
await user.save({validateBefore:false})
return res.status(200).jason(new ApiResponse(200,{},"password changed sucessfully"))
})
const getCurrentUser=asyncHandler(async(req,res)=>{
return res.status(200).json(new ApiResponse(200,req.useer,"current user details"))
})
const updateAccountDetails=asyncHandler(async(req,res)=>{

})
const updateUserAvatar =asyncHandler(async(req,res)=>{

})
const updateUserCoverImage =asyncHandler(async(req,res)=>{

})

export { registerUser, LoginUser,refreshAcessToken ,LogoutUser};