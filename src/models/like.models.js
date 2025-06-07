import mongoose, {Schema} from "mongoose";
import { ApiError } from "../utils/ApiError";


const likeSchema = new Schema({
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
    comment: {
        type: Schema.Types.ObjectId,
        ref: "Comment"
    },
    tweet: {
        type: Schema.Types.ObjectId,
        ref: "Tweet"
    },
    likedBy: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    
}, {timestamps: true})


likeSchema.pre("save",function (next){
    const count =(this.video?1:0)+
    (this.comment?1:0)+
    (this.tweet?1:0)

if(!count==1){
    return next(new ApiError(400,"Exactly one of video,commment,or Tweet must be provided"))
}

next()
})


//to make sure to avoid duplication

likeSchema.index({ likedBy: 1, video: 1 }, { unique: true, sparse: true })
likeSchema.index({ likedBy: 1, comment: 1 }, { unique: true, sparse: true })
likeSchema.index({ likedBy: 1, tweet: 1 }, { unique: true, sparse: true })
export const Like = mongoose.model("Like", likeSchema)