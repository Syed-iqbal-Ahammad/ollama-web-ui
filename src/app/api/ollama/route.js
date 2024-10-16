'use server'

import ollama from 'ollama'

export const LlmList = async () => {
    try{
        let res = await ollama.list()
        return res
    }
    catch (error) {
        console.log(error.message)
    }
}
export const abort = async () => {
    try{
        ollama.abort()
    }
    catch (error) {
        console.log(error.message)
    }
}

export const PullModel = async (model) => {
    try{
        return await ollama.pull({
            model: model,
            stream: false,
        })
    }
    catch (error) {
        console.log(error.message)
    }
}

export const ChatLama = async (model, response, abortController) => {
    try{
      
       let res = await fetch('http://localhost:11434/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: response,
                stream: true
            }),
            signal: abortController.signal
        })
        return res
    }
    catch (error) {
        console.log(error.message)
    }
}

