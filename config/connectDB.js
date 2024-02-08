import mongoose from "mongoose";

const connectDB = async () => {
  mongoose.Promise = global.Promise;
  mongoose.set('debug', true);
  try {
    mongoose.connect(process.env.MONGO_URI);
    console.log("connected to mongoDB");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;