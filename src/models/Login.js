
import mongoose from "mongoose";
const { Schema, model } = mongoose
import { v4 as uuidv4 } from 'uuid';


const LoginSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    date: { type: Date, default: Date.now },
    MongoStringUrl: { type: String, required: true },
    chats: [{ type: String, ref: 'Chat' }]
});



export default mongoose.models.Login || model("Login", LoginSchema); 