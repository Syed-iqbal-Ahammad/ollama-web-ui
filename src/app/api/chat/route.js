import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { model, messages, stream, OLLAMA_HOST } = await request.json();

        if (!model || !messages || !stream || !OLLAMA_HOST) {
            return NextResponse.json({ error: 'Model, messages, ollama host and stream flag are required.' }, { status: 400 });
        }
        const apiUrl = `${OLLAMA_HOST}/api/chat`;
        const fetchResponse = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                stream: stream,
            }),
        });
        if (!fetchResponse.ok) {
            return NextResponse.json({ error: 'Failed to connect to the upstream chat API.' }, { status: 500 });
        }
        const reader = fetchResponse.body.getReader();
        const decoder = new TextDecoder();

        const streamResponse = new ReadableStream({
            async pull(controller) {
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        controller.close(); 
                        break;
                    }
                    const chunk = decoder.decode(value);
                    const jsonObjects = chunk.split(/\n/).filter(Boolean);
                    jsonObjects.forEach((jsonObject) => {
                        try {
                            const parsedObject = JSON.parse(jsonObject);
                            controller.enqueue(new TextEncoder().encode(JSON.stringify(parsedObject) + '\n'));
                        } catch (error) {
                            console.error('Error parsing JSON', error);
                            controller.error(error); 
                        }
                    });
                }
            },
        });
        return new NextResponse(streamResponse, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error in API/chat:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
