import mongoose, {Schema} from "mongoose";
const PlaylistSchema=new Schema(
    {
owner:[{
    type:Schema.Types.ObjectId,
    ref:"User"
}],

name:{
    tyoe:String,
    required:true,
},
description:{
    type:String
},
videos:{
    type:Schema.Types.ObjectId,
            ref:"Videos"
},
},{timestamps:true})
    
    export const Playlist=mongoose.model("Playlist",PlaylistSchema)