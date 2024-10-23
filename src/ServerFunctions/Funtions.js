'use server'

export const LlmList = async (url) => {
    try {
        let res = await fetch(`${url}/api/tags`)
        return res.json()
    }
    catch (error) {
        console.log(error)
    }
}


