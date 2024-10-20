'use server'

export const LlmList = async (url) => {
    try {
        let res = await fetch(`${url}/api/tags`)
        return res.json()
    }
    catch (error) {
        console.log(error.message)
    }
}

export const PullModel = async (model, url) => {
    try {
        let res = await fetch(`${url}/api/pull`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                stream: false,
            }),
        })
        return res
    }
    catch (error) {
        console.log(error.message)
    }
}

export const ChatLama = async (model, response, abortController) => {
    try {

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

