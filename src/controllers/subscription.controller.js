import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriberId=req.user._id
if(!isValidObjectId(channelId)){
    throw new ApiError(400,"Invalid channel ID")
}
if (channelId===subscriberId.tostringify()){
    throw new ApiError(400,"you can not subscribe to your own channel ID")
}
const existing=await Subscription.findOne({subscriber:subscriberId,channel:channelId})
if (existing){
    await existing.deleteOne()
    return res.ststus(200).json(new ApiResponse(200,null,"unsubscribed successfully"))
}
else{
await Subscription.create({
    subscriber:subscriberId,channel:channelId
})
return res.status(201).json(new ApiResponse(201,null,"subscribed sucessfully"))
}
    // TODO: toggle subscription
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
if(!isValidObjectId(channelId)){
    throw new ApiError(400,"Invalid channel ID")

}
const subscribeers=await Subscription.find({channel:channelId}).populate("subscriber","username email avatar")
return res.status(200).json(new ApiResponse(200,subscribeers,"channel subscribered fetched"))


})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params

  if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Invalid subscriber ID")
    }

    const channels = await Subscription.find({ subscriber: subscriberId })
        .populate("channel", "username email avatar")

    return res.status(200).json(
        new ApiResponse(200, channels, "Subscribed channels fetched"))



})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}