'use server'

import connectDB from "@/Db/ConnectDb";
import { v4 as uuidv4 } from 'uuid';
import Login from "@/models/Login";
import Chat from "@/models/Chat";


const SignUp = async (url, name, email, password) => {
    await connectDB(`${url}/ollama`);
    try {
        let data = await Login.find({ email: email })
        if (data.length > 0) {
            return 'Email already exists'
        }
        try {
            await Login.create({
                _id: uuidv4(),
                name: name,
                email: email,
                password: password,
                MongoStringUrl: `${url}`,
            });
            return "Success"
        } catch (error) {
            return error.message
        }
    } catch (error) {
        return error.message
    }
};


const LogIn = async (url, email, password) => {
    try {
        await connectDB(`${url}/ollama`);
        try {
            let data = await Login.find({ email: email, password: password })
            if (data.length > 0) {
                return 'Success'
            }
            else {
                return 'Invalid credentials'
            }
        } catch (error) {
            return error.message
        }
    }
    catch (error) {
        return error.message
    }
}

const currentUser = async (url, email) => {
    try {
        if (url && email) {
            await connectDB(`${url}/ollama`);
            let data = await Login.find({ email: email })
            return data
        }
    } catch (error) {
        console.log(error.message)
    }

}

const SaveChat = async (url, model, chat, id, chatid) => {
    try {
        await connectDB(`${url}/ollama`);
        await Chat.create({
            _id: chatid,
            model: model,
            messages: chat,
            Login: id,
            content: chat[0].content,
        });
        await Login.updateOne({ _id: id }, { $push: { chats: chatid } })
        return "Success"
    } catch (error) {
        return error.message
    }
}
const LoadChat = async (url, id) => {
    try {
        await connectDB(`${url}/ollama`);
        let data = await Chat.find({ _id: id })
        return data
    } catch (error) {
        return error.message
    }
}
const UpdateChat = async (url, id, message) => {
    try {
        await connectDB(`${url}/ollama`);
        await Chat.updateOne({ _id: id }, { $set: { messages: message, timestamp: Date.now() } })
        return 'Success'
    } catch (error) {
        return error.message
    }
}
const CUserChats = async (url, id) => {
    try {
        await connectDB(`${url}/ollama`);
        let data = await Chat.find({ Login: id })
        return data
    } catch (error) {
        console.log(error.message)
    }
}
const EditOllamaHost = async (url, id, host) => {
    try {
        await connectDB(`${url}/ollama`);
        await Login.updateOne({ _id: id }, { $set: { OLLAMA_HOST: host } })
        return 'Success'
    } catch (error) {
        console.log(error.message)
    }
}
const DeleteChat = async (url, id, loginid) => {
    try {
        await connectDB(`${url}/ollama`);
        await Chat.deleteOne({ _id: id })
        await Login.updateOne({ _id: loginid }, { $pull: { chats: id } })
        return 'Success'
    } catch (error) {
        return error.message
    }
}
const EditChatContent = async (url, id, content) => {
    try {
        await connectDB(`${url}/ollama`);
        await Chat.updateOne({ _id: id }, { $set: { content: content } })
        return 'Success'
    } catch (error) {
        console.log(error.message)
    }
}
const EditUserName = async (url, id, name) => {
    try {
        await connectDB(`${url}/ollama`);
        await Login.updateOne({ _id: id }, { $set: { name: name } })
        return 'Success'
    } catch (error) {
        console.log(error.message)
    }
}
const DeleteUser = async (url, id) => {
    try {
        await connectDB(`${url}/ollama`);
        await Login.deleteOne({ _id: id })
        return 'Success'
    } catch (error) {
        return error.message
    }
}

export {

    SignUp,
    LogIn,
    currentUser,
    SaveChat,
    LoadChat,
    UpdateChat,
    DeleteChat,
    CUserChats,
    EditUserName,
    EditChatContent,
    DeleteUser,
    EditOllamaHost,
}


