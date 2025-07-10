import mongoose from 'mongoose';

const connectDB = async ()=>{
    mongoose.connection.on('connected', ()=> console.log("DATABASE CONNECTION IS ON"))
    await mongoose.connect(`${process.env.MONGODB_URI}/prescripto`)

}

export default connectDB