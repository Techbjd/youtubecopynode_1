import jwt from "jsonwebtoken"
import {User }from "../models/user.models.js"
import { Apierror } from "../utils/Apierror.js"
import { asyncHandler } from "../utils/asyncHandler.js"


export const verifyJWT=asyncHandler(async(req,_,next)=>{
const token=read.cookies.accessToken||req.header("Authorization")?.replace("Bearer","")

if(!token){
    throw new Apierror(401,"unothorized")
}


try {
    const decodeToken=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET )

    const user=await User.findById(decodeToken?._id).select("-password -refreshToken")
     if(!user){
        throw new Apierror(401,"Unauthorized user")

    }
    req.user=user;
    next();
} catch (error) {
    throw new Apierror(401,error?.message|| "invalid messsage access token")
}

})
export  default verifyJWT