"use server"
import mongoose from "mongoose";
const connectDB = async (url) => {
    try {
      await mongoose.connect(`${url}`);
    } catch (error) {
      console.error(error.message);
    }
  }

  export default connectDB

  