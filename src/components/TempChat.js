"use client"
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

//ui
import { ComboboxDemo } from "@/components/Combobox";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import Loading from "./ui/Loading";
import CopyToClipboard from "react-copy-to-clipboard";
import MarkDown from "./MarkDownC";

// icons
import { IoMdArrowRoundUp } from "react-icons/io";
import { PiCopyThin } from "react-icons/pi";
import { PiCheckCircleDuotone } from "react-icons/pi";
import { FaSquare } from "react-icons/fa";
import { useRouter } from 'next/navigation'

//redux hook
import { useAppSelector } from '@/lib/hooks'

//libraries

const TempChat = () => {

    const router = useRouter()
    const currentselectvalue = useAppSelector((state) => state.LLm.SelectValue)

    const [theme, settheme] = useState('')
    const [FinalResponse, setFinalResponse] = useState([])
    const [button, setbutton] = useState(false)
    const [generating, setgenerating] = useState('')
    const [abortController, setAbortController] = useState(null);
    const [copy, setcopy] = useState(false)
    const [currentUser, setcurrentUser] = useState(``)
    const textarea = useRef()
    const buttonRef = useRef()
    const loadingref = useRef()
    useEffect(() => {
        settheme(localStorage.getItem('theme'))
        setcurrentUser(localStorage.getItem('currentUser'))
    }, [])



    const handleChatButtonClick = async () => {
        if (generating !== '') {
            try {
                abortController.abort();
                setgenerating('');
                setbutton(false);
                setAbortController(null)
                if (FinalResponse[FinalResponse.length - 1].role === "user") {
                    setFinalResponse([...FinalResponse.slice(0, -1)])
                } else if (FinalResponse[FinalResponse.length - 1].role === "assistant") {

                }
            } catch (error) {
                if (error.name === 'AbortError') {
                    console.log('Request was aborted');
                } else {
                    console.error('An unexpected error occurred:', error);
                }
            }
        } else {
            const newAbortController = new AbortController();
            setAbortController(newAbortController);
            let val = textarea.current.value
            setFinalResponse([...FinalResponse, {
                role: "user",
                content: val
            }])
            textarea.current.value = ''
            setbutton(false)
            try {
                await ollamaChat(currentselectvalue, [...FinalResponse, {
                    role: "user",
                    content: val
                }], newAbortController);
            } catch (error) {
                console.log('Error:', error);
            }
        }
    }
    const ollamaChat = async (model, response, abortController) => {
        setgenerating("funload")
        let c = JSON.parse(localStorage.getItem('currentUser'))
        let res = await fetch(`${c[0].OLLAMA_HOST}/api/chat`, {
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
        },{ cache: 'force-cache' })
        const reader = res.body.getReader();
        let result =
        {
            "role": "assistant",
            "content": "",
            done: false
        };
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                result.done = true
                break;
            }
            const responseText = new TextDecoder('utf-8').decode(value);
            const jsonObjects = responseText.split(/\n/).filter(Boolean);
            jsonObjects.forEach((jsonObject) => {
                try {
                    const parsedObject = JSON.parse(jsonObject);
                    result.content += parsedObject.message.content;
                } catch (error) {
                    console.error("Error parsing JSON", error);
                }
            });
            if (loadingref.current) {
                loadingref.current.style.display = 'none'
            }
            setgenerating('gen')
            setFinalResponse([...response, result])
            if (loadingref.current) {
                loadingref.current.style.display = 'none'
            }
        }
        setgenerating('')
        console.log(FinalResponse)
    }
    const handleCopy = () => {
        setcopy(true);
        setTimeout(() => {
            setcopy(false);
        }, 2000);
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            buttonRef.current.click()
        }
    }
    const textChange = (e) => {
        if (textarea.current.value.length > 0) {
            setbutton(true)
        } else {
            setbutton(false)
        }
    }

    return (
        <>
            <div className="bg-background text-foreground w-[100vw] h-[100vh] overflow-hidden">
                <div className="px-6 py-3 h-[100vh] w-[100vw] ">
                    <div className=" grid grid-rows-[1fr_8fr_1fr] h-[100vh]  ">
                        <nav className="flex justify-between p-2  ">
                            <ComboboxDemo />
                            <div>
                                {currentUser ? <Button onClick={() => router.push('/')} variant="auth" className='rounded-lg p-3'>Home</Button> : <Button variant="auth" onClick={() => router.push('/auth')} className='rounded-lg px-3 py-4'>Sign Up</Button>}
                            </div>
                        </nav>
                        <div className=" py-3 px-10 flex justify-center items-center overflow-auto ">
                            <div className="w-full h-full overflow-auto pb-16 ">
                                <div className='m-auto w-3/4 '>

                                    {FinalResponse.length === 0 &&
                                        <div className='flex justify-center items-center'>
                                            <Image
                                                src="/ollama.png"
                                                width={385}
                                                height={385}
                                                alt="#"
                                                priority={true}
                                                className='size-auto'
                                            />
                                        </div>}


                                    <div className='flex flex-col gap-10'>
                                        {FinalResponse.map((item, index) => {
                                            return <div className=' flex flex-col min-h-10 ' key={index}>
                                                <div>
                                                    {item.role === 'user' &&
                                                        <div className=''>
                                                            <div className='flex items-start justify-end gap-3 '>
                                                                <span className='text-left relative top-4 max-w-xl rounded-l-2xl rounded-br-2xl rounded-tr-sm break-words text-foreground bg-secondary  px-5 py-2 whitespace-pre-wrap' >{item.content}
                                                                </span>
                                                                <span className='text-foreground bg-secondary text-2xl flex items-center justify-center pb-1.5 rounded-full w-10 h-10 overflow-hidden '>s</span>
                                                            </div>
                                                        </div>
                                                    }
                                                </div>
                                                <div>
                                                    {generating === 'funload' && item.done !== true && FinalResponse.length - index === 1 && <div className="flex items-start justify-start gap-4 relative top-[39.5px]" ref={loadingref} >
                                                        <Image
                                                            src="/lama.png"
                                                            width={30}
                                                            height={30}
                                                            className={` ${theme !== 'light' ? 'invert' : ''} size-auto`}
                                                            alt="#"
                                                        />
                                                        <div className='relative top-1.5'>
                                                            <Loading />
                                                        </div>
                                                    </div>}
                                                    {item.role === 'assistant' && <div className='flex  items-start justify-start gap-4 '>
                                                        <Image
                                                            src="/lama.png"
                                                            width={30}
                                                            height={30}
                                                            className={` ${theme !== 'light' ? 'invert' : ''} size-auto`}
                                                            alt="#"
                                                        />
                                                        <div className=' max-w-3xl break-words overflow-y-hidden overflow-x-auto  '>
                                                            <div className=' leading-3 pb-3 '>
                                                                <MarkDown content={item.content} />
                                                                <CopyToClipboard text={item.content} className='cursor-pointer my-2' onCopy={handleCopy} >
                                                                    {copy ? <PiCheckCircleDuotone /> : <PiCopyThin />}
                                                                    {/* some thing wrong here */}
                                                                </CopyToClipboard>
                                                            </div>
                                                        </div>
                                                    </div>}
                                                </div>
                                            </div>
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="relative flex justify-center items-center">
                            <div className="bg-secondary w-2/3 fixed flex justify-center items-center rounded-full py-2 px-4 gap-2 bottom-6">
                                <Textarea ref={textarea} onKeyDown={handleKeyDown} onChange={() => { textChange() }} autoFocus placeholder={`${currentselectvalue ? `Message to ${currentselectvalue}` : ''}`} id="message" name="chat" rows="1" className='' disabled={!currentselectvalue} />
                                <div className="flex justify-center items-center gap-3">
                                    <Button variant={generating !== '' ? "gen" : "send"} ref={buttonRef} size={generating !== '' ? "gen" : "send"} disabled={generating !== '' ? false : !currentselectvalue || !button} onClick={() => { handleChatButtonClick() }} >
                                        {generating === 'funload' || generating === 'gen' ? <FaSquare className='size-3' /> : <IoMdArrowRoundUp className='size-5' />}
                                    </Button>
                                </div>
                            </div>
                            <div className="bg-background w-2/3 h-[23.7px] fixed bottom-0"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default TempChat
