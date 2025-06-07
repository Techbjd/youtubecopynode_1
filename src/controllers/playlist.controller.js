import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
const userId=req.user._id
if(!name){
    throw new ApiError(400,"Playlist name is required")
}
const newPlaylist=await Playlist.create({
    name,
    description,
    owner:userId
})
return res.status(200).json(new ApiResponse(200,newPlaylist,"paly list created sucessfully"))
    //TODO: create playlist
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new ApiError(400, "Invalid user ID")
    }
    const playlist=await Playlist.find({owner:userId}).populate("videos")

return res.status(200).json(
        new ApiResponse(200, playlists, "User playlists fetched")
    )

    //TODO: get user playlists
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }
    const playlist=await playlist.findById(playlistId).populate("videos")
        if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).json(
        new ApiResponse(200, playlist, "Playlist fetched")
    )
    //TODO: get playlist by id
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
if(!mongoose.Types.ObjectId.isValid(playlistId)||!mongoose.Types.ObjectId.isValid(videoId))
{
    throw new ApiError(400,"Invalid Playlist or videoID")
}
    const playlist = await Playlist.findById(playlistId)
    if (!playlist) throw new ApiError(404, "Playlist not found")

    if (playlist.videos.includes(videoId)) {
        throw new ApiError(400, "Video already in playlist")
    }

    playlist.videos.push(videoId)
    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video added to playlist")
    )
})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
     if (!mongoose.Types.ObjectId.isValid(playlistId) || !mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid playlist or video ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        {
         throw new ApiError(404, "Playlist not found")
    }
    playlist.videos = playlist.videos.filter(
        (vid) => vid.toString() !== videoId
    )
    await playlist.save()

    return res.status(200).json(
        new ApiResponse(200, playlist, "Video removed from playlist")
    )
    // TODO: remove video from playlist

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
     if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    }

    const playlist = await Playlist.findById(playlistId)
    if (!playlist)
        {
             throw new ApiError(404, "Playlist not found")
        }
    await playlist.deleteOne()

    return res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted")
    )

    // TODO: delete playlist
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    
     if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlist ID")
    
    }
    const playlist=await playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400,"invalid playlist id")
    }
    if(name){
        playlist.name=name
    }
    if(description){
        playlist.description=description
    }
    await playlist.save(    )
    return res.status(200).json(new ApiResponse(200,playlist,"playlist updated"))
    //TODO: update playlist
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}