import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"


const userSchema=new Schema(
    {
usename:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true,
    index:true
},
email:{
    type:String,
    required:true,
    unique:true,
    lowercase:true,
    trim:true
},
fullname:{
    type:String,
    required:true,
    unique:true,
    trim : true,
    index:true
},
avatar:{
    type:String,//cloudinary URL
    required:true,

},
coverImage:{
    type:String,
},
watchHisstory:[
    {
        type:Schema.Types.ObjectId,
        ref:"Video"
    }
],
password:{
    type:String,
    required:[true,"Password is required"]
},
refreshToken:{
    type:String
},



    },
    {
        timestamps:true//give createdat: and updatedat:
    }
)

userSchema.pre("save",async function (next){
    if(!this.isModified("password")) return next()
this.password=bcrypt.hash(this.password,12)


    next()
})

userSchema.methods.isPasssordCorrect = async function(password){
   return await bcrypt.compare(password,this.password)
}
  // const jwt = require('jsonwebtoken');

userSchema.methods.generateAccessToken = function () {
    // Short-lived access token depend on us
    return jwt.sign(
        {
          //Payload: Contains the actual data (claims) you want to transmit.
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN // Fixed typo
        }
    );
};

userSchema.methods.generateRefreshToken = function () {
    // Long-lived refresh token
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN // Fixed typo
        }
    );
};



export const User=mongoose.model("User",userSchema)