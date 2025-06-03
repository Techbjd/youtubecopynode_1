import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
const VideoSchema=new Schema(
    {
videoFile:{
    type:String,//cloudinary url
    required:true
   
},
thumbnail:{
    type:String,//cloudinary url
    required:true,
},
title:{
    type:String,//cloudinary url
    required:true
},
description:{
    type:String,//cloudinary url
    required:true
},
views:{
    type:Number,//
    default:0,
},
duration:{
    type:Number,//
    required:true,
},
ispublished:{
    type:Boolean,
    default:true
},
owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
},
},
{timestamps:true}
)


VideoSchema.plugin(mongooseAggregatePaginate)
export const Video=mongoose.model("Video",VideoSchema)