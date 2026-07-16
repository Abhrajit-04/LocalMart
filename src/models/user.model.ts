import mongoose from "mongoose";

export interface IUser{
    _id?:mongoose.Types.ObjectId;
    name:string;
    email:string;
    password?:string;
    mobile?:string;
    role:
"user"
|"deliveryboy"
|"shopowner"
|"superadmin"
    image?:string;
    selectedShop?:mongoose.Types.ObjectId;
    location: {
    type: {
        type: StringConstructor;
        enum: string[];
        default: string;
    };
    coordinates: {
        type: NumberConstructor[];
        default: number[];
    };
},
defaultAddress:{
    type:String,
    default:""
},

savedAddresses:[
{
label:String,

address:String,

location:{
type:{
type:String,
default:"Point"
},

coordinates:{
type:[Number],
default:[0,0]
}
}
}
],
socketId: string | null;
isOnline: boolean;
isActive: boolean;
}
const userSchema=new mongoose.Schema<IUser>({
name:{type:String,required:true},
email:{type:String,required:true,unique:true},
password:{type:String,required:false},
mobile:{type:String,required:false},
role:{type:String,enum:[
"user",
"deliveryboy",
"shopowner",
"superadmin"
],default:"user"},
image:{type:String},
selectedShop:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Shop",
    default:null
},
location:{type:{type:String,enum:["Point"],default:"Point"},
coordinates:{type:[Number],default:[0,0]}},
socketId: {
    type: String,
    default: null
},

isOnline: {
    type: Boolean,
    default: false
},

isActive: {
    type: Boolean,
    default: true
}
},{timestamps:true})

userSchema.index({location:"2dsphere"})
const User=mongoose.models.User || mongoose.model("User",userSchema)
export default User;