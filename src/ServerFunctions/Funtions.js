'use server'

export const LlmList = async () => {
    try{
        let res = await fetch('http://localhost:11434/api/tags', { cache: 'no-store' })
        return res.json()
    }
    catch (error) {
        console.log(error.message)
    }
}

export const PullModel = async (model) => {
    try{
        let res = await fetch('http://localhost:11434/api/pull', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                stream: false,
            }),
        }, { cache: 'no-store' })
        return res.json()
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
        }, { cache: 'no-store' })
        return res
    }
    catch (error) {
        console.log(error.message)
    }
}

