import mongoose, {Schema} from "mongoose";
const subscriptionSchema=new Schema(
    {
        subscriber:{
            type:Schema.Types.ObjectId,
                        ref:"User"
        }
,
cahnnel:{
    type:Schema.Types.ObjectId,
            ref:"USer"
},
         },
            {
                timestamps:true//give created at and updated at
            }
        );
        export const Subscription=mongoose.model("Subscription",subscriptionSchema)