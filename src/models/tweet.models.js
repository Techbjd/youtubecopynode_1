import mongoose, {Schema} from "mongoose";
const tweetSchema=new Schema(
    {
        content:{
            type:String,
            required:true,
        },
        owner:{
            type:Schema.Types.ObjectId,
            ref:"CommOwnerent"
        },
         },
            {
                timestamps:true//give created at and updated at
            }
        )
        export const Tweet=mongoose.model("Tweet",tweetSchema)