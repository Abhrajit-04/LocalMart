import mongoose from "mongoose";

const mongoodbUri=process.env.MONGODB_URI

if (!mongoodbUri){
    throw new Error("MONGODB_URI is not defined in environment variables")
}


let cached=global.mongoose
if(!cached){
    cached=global.mongoose={conn:null,promise:null}
}

const connectDb=async()=>{
    if(cached.conn){
        return cached.conn
    }
    if(!cached.promise){
        cached.promise=mongoose.connect(mongoodbUri).then((conn)=>conn.connection)
    }    
    try {
        const conn=await cached.promise
        return conn
    } catch (error) {
        console.log(error)

    }

}
export default connectDb;