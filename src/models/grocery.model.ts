import mongoose from "mongoose";

export interface IGrocery {
    _id?:mongoose.Types.ObjectId,
    name:string,
    category:string,
    price:number,
    unit:string,
    image:string,
    shopId: mongoose.Types.ObjectId;
    stock: number;
    isAvailable: boolean;
    createdAt?:Date,
    updatedAt?:Date
}

const grocerySchema=new mongoose.Schema<IGrocery>({
    name:{type:String,required:true},
    category:{type:String,
        enum:["Fruits & Vegetables",
                "Dairy & Eggs",
                "Rice, Atta & Grains",
                "Snacks & Biscuits",
                "Spices & Masalas",
                "Beverages & Drinks",
                "Personal Care",
                "Household Essentials",
                "Instant & Packaged Food",
                "Baby & Pet Care"],required:true},
    price:{type:Number,required:true},
    unit:{type:String,required:true,enum:["kg","g","litre","ml","pieces","pack","dozen","bottle","box","can","bag","jar","tube","other"]},
    image:{type:String,required:true},
    shopId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Shop",
    required:true
},

stock:{
    type:Number,
    default:0
},

isAvailable:{
    type:Boolean,
    default:true
}
},{timestamps:true})

const Grocery=mongoose.models.Grocery || mongoose.model("Grocery", grocerySchema)
export default Grocery;


