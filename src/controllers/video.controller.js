import mongoose, {isValidObjectId} from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

// Get all videos with optional filtering, sorting, pagination, and userId filter
const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy = "createdAt", sortType = "desc", userId } = req.query

    const matchQuery = {}
    if (query) {
        matchQuery.title = { $regex: query, $options: "i" } // Search by title
    }
    if (userId && isValidObjectId(userId)) {
        matchQuery.owner = new mongoose.Types.ObjectId(userId)
    }

    const sortOptions = {
        [sortBy]: sortType === "asc" ? 1 : -1
    }

    const aggregate = Video.aggregate([
        { $match: matchQuery },
        { $sort: sortOptions }
    ])

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        populate: {
            path: "owner",
            select: "username avatar"
        }
    }

    const videos = await Video.aggregatePaginate(aggregate, options)

    return res.status(200).json(new ApiResponse(200, videos, "Videos fetched successfully"))
})

// Upload video file and thumbnail, then create video document
const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    const videoFile = req.files?.videoFile[0]
    const thumbnail = req.files?.thumbnail[0]

    if (!videoFile || !thumbnail) {
        throw new ApiError(400, "Both video file and thumbnail are required")
    }

    const uploadedVideo = await uploadOnCloudinary(videoFile.path)
    const uploadedThumbnail = await uploadOnCloudinary(thumbnail.path)

    const newVideo = await Video.create({
        videoFile: uploadedVideo.url,
        thumbnail: uploadedThumbnail.url,
        title,
        description,
        duration: uploadedVideo.duration,
        owner: req.user._id
    })

    return res.status(201).json(new ApiResponse(201, newVideo, "Video published successfully"))
})


const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Invalid video ID")
    }

    const video = await Video.findById(videoId).populate("owner", "username avatar")
    if (!video) throw new ApiError(404, "Video not found")

    return res.status(200).json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own video")
    }

    video.title = title || video.title
    video.description = description || video.description

    await video.save()
    return res.status(200).json(new ApiResponse(200, video, "Video updated successfully"))
})


const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only delete your own video")
    }

    await video.deleteOne()
    return res.status(200).json(new ApiResponse(200, null, "Video deleted successfully"))
})


const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    const video = await Video.findById(videoId)
    if (!video) throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You can only update your own video")
    }

    video.isPublished = !video.isPublished
    await video.save()

    return res.status(200).json(new ApiResponse(200, video, "Video publish status toggled"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
