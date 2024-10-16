import mongoose from "mongoose";
const { Schema, model } = mongoose
import { v4 as uuidv4 } from 'uuid';

const chatSchema = new Schema({
    _id: { type: String, default: uuidv4 },
    model: { type: String, required: true },
    messages: { type: Array, required: true },
    timestamp: { type: Date, default: Date.now },
    Login: { type: String, ref: 'Login' },
    content: { type: String , required: true }
});

export default mongoose.models.Chat || model('Chat', chatSchema);


