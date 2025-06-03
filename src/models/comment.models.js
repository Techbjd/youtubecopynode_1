
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"
import mongoose, {Schema} from "mongoose";
const CommentSchema=new Schema(
    {
         content:{
            type:String,
            required:true
         },
         video:{
            type:Schema.Types.ObjectId,
            ref:"Video"
         },
         owner:{
            type:Schema.Types.ObjectId,
            ref:"User"
         },
     
    },
            {
                timestamps:true//give created at and updated at
            }
        )
        CommentSchema.plugin(mongooseAggregatePaginate)
        export const Comment=mongoose.model("Comment",CommentSchema)

