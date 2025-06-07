import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
const {content}=req.body
const userId=req.user._id
if (!content||content.trim()==""){
    throw new ApiError(400,"Tweet content is required")
}
    const tweet=await Tweet.create({content,owner:userId})
return res.status(201).json(ApiResponse(201,tweet,"tweet created sucessfully"))
    //TODO: create tweet
})

const getUserTweets = asyncHandler(async (req, res) => {
const {userId}=req.params
if(!isValidObjectId(userId)){
    throw new ApiError(400,"Invalid user ID")
}
const tweets=await Tweet.find({owner:userId}).sort({createdAt:-1})
return res.status(200).json(new ApiResponse(200,tweets,"user tweets featched successfuly"))


    // TODO: get user tweets
})

const updateTweet = asyncHandler(async (req, res) => {
const {tweetId}=req.params;
const {content}=req.body
if(!isValidObjectId(tweetId))
    {
    throw new ApiError(400,"Invalid tweet ID")
}
const tweet = await Tweet.findById(tweetId)

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }
//check for current user is doing tweets
if(tweet.owner.toString()!== req.user._id.toString()){
    throw new ApiError(403, "You are not authorized to update this tweet")
}
tweet.content=content||tweet.content
await tweet.save()
return res.statsus(200).json(new ApiResponse(200,tweet,"tweet updated successfully"))

    //TODO: update tweet
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}