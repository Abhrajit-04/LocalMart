import mongoose from "mongoose";

export interface IMessage{
    _id?: mongoose.Types.ObjectId,
    roomId:mongoose.Types.ObjectId,
    text:string,
    senderId:mongoose.Types.ObjectId,
    time:string,
    createdAt?:Date,
    updatedAt?:Date
}

const messageSchema=new mongoose.Schema<IMessage>({
    roomId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    text:{
        type:String,
        required:true
    },
    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        refPath:"User"
    },
    time:{
        type:String,
        required:true
    }
},{timestamps:true})

const Message=mongoose.models.Message || mongoose.model("Message",messageSchema)
export default Message