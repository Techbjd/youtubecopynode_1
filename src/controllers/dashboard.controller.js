import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
const userId=req.user._id
const videos=await Video.find({owner:userId})
const totalVideos=videos.length
const totalViews=videos.reduce((sum,video)=>sum+video.views,0)

const videoIds=video.map(v=>v._id)
const totalLikes=await Like.countDocuments({
    video:{
        $in:videoIds
    }
})
const totalSubscribers=await Subscription.countDocuments({
    chanel:userId
})

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            totalViews,
            totalLikes,
            totalSubscribers
        }, "Channel stats fetched successfully")
    )
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
})

const getChannelVideos = asyncHandler(async (req, res) => {
    const userId = req.user._id
    const { page = 1, limit = 10 } = req.query

    const videos = await Video.find({ owner: userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(parseInt(limit))

    const totalVideos = await Video.countDocuments({ owner: userId })

    return res.status(200).json(
        new ApiResponse(200, {
            totalVideos,
            page: parseInt(page),
            limit: parseInt(limit),
            videos
        }, "Videos fetched successfully")
    )
})


export {
    getChannelStats, 
    getChannelVideos
    }