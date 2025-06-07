import mongoose from "mongoose"
import { Comment } from "../models/comment.model.js"
import { Video } from "../models/video.model.js" // To check if the video exists
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params                  // Extract video ID from URL parameters
    const { page = 1, limit = 10 } = req.query      // Get pagination info from query params

    // Validate that videoId is provided
    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    // Check if videoId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format")
    }

    // Check if the video actually exists in DB
    const videoExists = await Video.findById(videoId)
    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    // Fetch paginated, sorted comments for the video
    const comments = await Comment.find({ video: videoId })
        .sort({ createdAt: -1 })                            // Newest comments first
        .skip((page - 1) * limit)                           // Skip records for previous pages
        .limit(parseInt(limit))                             // Limit results to the current page

    // Count total number of comments for the video
    const total = await Comment.countDocuments({ video: videoId })

    // Send successful response
    return res.status(200).json(
        new ApiResponse(200, {
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            comments
        }, "Comments fetched successfully")
    )
})

/**
 * Add a comment to a video
 */
const addComment = asyncHandler(async (req, res) => {
    const { videoId } = req.params               // Video ID from the route
    const { content } = req.body                 // Comment text from request body
    const userId = req.user._id                  // Logged-in user's ID (from auth middleware)

    // Validate required fields
    if (!videoId || !content) {
        throw new ApiError(400, "Video ID and comment content are required")
    }

    // Check if video ID format is valid
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid video ID format")
    }

    // Ensure video exists
    const videoExists = await Video.findById(videoId)
    if (!videoExists) {
        throw new ApiError(404, "Video not found")
    }

    // Create the comment in the database
    const newComment = await Comment.create({
        content,
        video: videoId,
        user: userId
    })

    // Return response with the newly added comment
    return res.status(201).json(
        new ApiResponse(201, newComment, "Comment added successfully")
    )
})

/**
 * Update a user's comment
 */
const updateComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params             // Comment ID from the route
    const { content } = req.body                 // New content for the comment
    const userId = req.user._id                  // ID of logged-in user

    // Validate input
    if (!commentId || !content) {
        throw new ApiError(400, "Comment ID and content are required")
    }

    // Find the comment by its ID
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Ensure the user owns the comment
    if (!comment.user.equals(userId)) {
        throw new ApiError(403, "You are not authorized to update this comment")
    }

    // Update and save the comment
    comment.content = content
    await comment.save()

    // Send updated comment in the response
    return res.status(200).json(
    new ApiResponse(200, comment, "Comment updated successfully")
    )
})

/**
 * Delete a user's comment
 */
const deleteComment = asyncHandler(async (req, res) => {
    const { commentId } = req.params             // Comment ID to delete
    const userId = req.user._id                  // Current user ID

    // Validate presence of comment ID
    if (!commentId) {
        throw new ApiError(400, "Comment ID is required")
    }

    // Find the comment
    const comment = await Comment.findById(commentId)
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    // Check ownership
    if (!comment.user.equals(userId)) {
        throw new ApiError(403, "You are not authorized to delete this comment")
    }

    // Delete the comment
    await comment.deleteOne()

    // Send success response
    return res.status(200).json(
        new ApiResponse(200, null, "Comment deleted successfully")
    )
})

// Export all controller functions
export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
