import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Tweet } from "../models/tweet.model.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"


const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    const userId=req.user._id

    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"Invalid video Id")
    }
const video=await Video.findById(videoId)
if (!video) throw new ApiError(404," video not found")

    const existingLike=await Like.findByone({likedBy:userId,video:videoId})
if (existingLike) {
        await existingLike.deleteOne()
        return res.status(200).json(new ApiResponse(200, null, "Video unliked"))
    }

    await Like.create({ likedBy: userId, video: videoId })
    return res.status(201).json(new ApiResponse(201, null, "Video liked"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
const userId=user._id
if(!mongoose.Types.ObjectId.isValid(commentId)){
 
throw new ApiError(404,"Invalid comment Id")
}
    const comment = await Comment.findById(commentId)
if(!comment){
    throw new ApiError(404,"comment not found")
}
const existingLike=await Like.findOne({
    likedBy:userId,comment:commentID
})
if(existingLike){
    await existingLike.deleteOne()
    return res.status(200).json(new ApiResponse(200,null,"comment unliked"))
}
await Like.create({
    likedBy:userId,comment:commentId
})
return res.status(201).json(new ApiResponse(201,null,"comment liked"))
    //TODO: toggle like on comment

})

const toggleTweetLike = asyncHandler(async (req, res) => {
const {tweetId} = req.params
    //TODO: toggle like on tweet
const userId=req.user._id

if (!mongoose.Types.ObjectId.isValid(tweetId)){
    throw new ApiError(400,"invalid tweet Id")
}
const tweet=await Tweet.findById(tweetId)
if(!tweet) {
    throw new ApiError(404,"Tweet not found")
}
const existingLike=await Like.findOne({
    likedBy:userId,tweet:tweetId
})
if(existingLike){
    await existingLike.deleteOne()
    return res.status(200).json(new ApiResponse(200,null,"comment unliked"))
}
await Like.create({
    likedBy:userId,tweet:tweetId
})
return res.status(201).json(new ApiResponse(201,null,"tweet Liked"))

})

const getLikedVideos = asyncHandler(async (req, res) => {
const userId=req.user._id
const likes =await Like.find({likedBy:userId,video:{$ne:null}}).populate("video") 
})
const likedvideos=likes.map(like=>like.video)
return res.status(200).json(
        new ApiResponse(200, likedVideos, "Liked videos fetched successfully")
    )
export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}