"use client"
import React from 'react'
import { useEffect, useRef, useState } from "react";

//ui
import {
    Sidebar,
    SidebarContent,
    SidebarHeader,
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
    SidebarFooter,
} from "@/components/ui/sidebar"

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
import { TbEdit } from "react-icons/tb";

//redux hook
import { useAppSelector } from '@/lib/hooks'

//libraries
import { SaveChat } from "@/DbHandler/DbHandler";
import { Toaster, toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation'
import { LoadChat } from "@/DbHandler/DbHandler";
import { UpdateChat } from "@/DbHandler/DbHandler";
import Image from 'next/image'
import { OllamaFooter } from "./OllamaFooter";
import { OllamaDropD } from "./OllamaDropD";
import { CUserChats } from "@/DbHandler/DbHandler";
import { EditChatContent } from '@/DbHandler/DbHandler';
import { OllamaHeader } from './OllamaHeader';

const OllamaPage = React.forwardRef(({ chatid }, ref) => {
    const currentselectvalue = useAppSelector((state) => state.LLm.SelectValue)
    const router = useRouter()

    const [theme, settheme] = useState('')
    const [FinalResponse, setFinalResponse] = useState([])
    const [button, setbutton] = useState(false)
    const [generating, setgenerating] = useState('')
    const [abortController, setAbortController] = useState(null);
    const [copy, setcopy] = useState(false)
    const [Charts, setCharts] = useState([])
    const [name, setname] = useState('')

    const textarea = useRef()
    const buttonRef = useRef()
    const loadingref = useRef()
    const chatRef = useRef([])

    useEffect(() => {
        if (theme !== localStorage.getItem('theme')) {
            settheme(localStorage.getItem('theme'))
        }
    }, [theme])

    useEffect(() => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser) {
            setname(currentUser[0].name)
        }
        const load = async () => {
            let cchart = await currentchats()
            if (cchart) {
                setCharts(cchart)
            }
        }
        load()
        if (FinalResponse.length > 0) {
            if (currentUser) {
                if (FinalResponse[FinalResponse.length - 1].done === true) {
                    if (chatid) {
                        const updatechat = async () => {
                            let u = await UpdateChat(currentUser[0].MongoStringUrl, chatid, FinalResponse)
                            if (u !== "Success") {
                                toast.error(u, {
                                    position: 'top-center',
                                })
                            }
                        }
                        updatechat()
                    } else {
                        let uuid = uuidv4()
                        const save = async () => {
                            let c = await SaveChat(currentUser[0].MongoStringUrl, currentselectvalue, FinalResponse, currentUser[0]._id, uuid)
                            currentUser[0].chats.push(uuid)
                            localStorage.setItem('currentUser', JSON.stringify(currentUser))
                            if (c === "Success") {
                                router.push(`/c/${uuid}`)
                            } else {
                                toast.error(c, {
                                    position: 'top-center',
                                })
                            }
                        }
                        save()
                    }
                }
            }
        }
    }, [FinalResponse, chatid, currentselectvalue, router])

    useEffect(() => {
        const loadchat = async () => {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'))
            if (currentUser) {
                let mongourl = currentUser[0].MongoStringUrl
                let chat = await LoadChat(mongourl, chatid)
                if (chat.length === 1) {
                    setFinalResponse(chat[0].messages)
                } else if (chat.length > 1) {
                    toast.error(`multiple  chats found on chat ${chatid}`, {
                        position: 'top-center',
                    })
                    router.push('/')
                } else if (chat.length === 0) {
                    toast.error(`unable to connect to ${chatid}`, {
                        position: 'top-center',
                    })
                    router.push('/')
                }
                else {
                    toast.error(chat, {
                        position: 'top-center',
                    })
                    router.push('/')
                }
            }
        }
        if (chatid) {
            loadchat()
        }
    }, [chatid, router])
    const currentchats = async () => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser) {
            let mongourl = currentUser[0].MongoStringUrl
            let chat = await CUserChats(mongourl, currentUser[0]._id)
            let fchats = chat.map(item => ({
                _id: item._id,
                content: item.content
            }));
            return JSON.parse(JSON.stringify(fchats))
        }
    }
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
                    console.log('An unexpected error occurred:', error.message);
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

            }
        }
    }
    const ollamaChat = async (model, response, abortController) => {
        setgenerating("funload");
        let c = JSON.parse(localStorage.getItem('currentUser'))
        let res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: model,
                messages: response,
                stream: true,
                OLLAMA_HOST: c[0].OLLAMA_HOST,
            }),
            signal: abortController.signal
        });
        if (!res.ok) {
            throw new Error('Failed to fetch chat data. Server responded with an error.');
        }
        const reader = res.body.getReader();
        let result = {
            "role": "assistant",
            "content": "",
            done: false
        };
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                result.done = true;
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
                loadingref.current.style.display = 'none';
            }
            setgenerating('gen');
            setFinalResponse([...response, result]);

            if (loadingref.current) {
                loadingref.current.style.display = 'none';
            }
        }
        setgenerating('');
    };

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
    const textChange = () => {
        if (textarea.current.value.length > 0) {
            setbutton(true)
        } else {
            setbutton(false)
        }
    }

    const keydown = async (e, index, id) => {
        e.stopPropagation()
        if (e.key === 'Enter') {
            e.preventDefault();
            const divElement = chatRef.current[index]
            divElement.contentEditable = false;
            let c = JSON.parse(localStorage.getItem('currentUser'))
            await EditChatContent(c[0].MongoStringUrl, id, divElement.innerText)
        }
    }

    return (
        <>
            <div className="bg-background text-foreground w-full h-full select-none overflow-hidden ">
                <Toaster richColors />
                <SidebarProvider className="w-full h-full">
                    <Sidebar variant="inset" className="w-auto h-full " >
                        <SidebarHeader className="bg-background ">
                            <div className="flex justify-between  px-1 items-center">
                                <div>
                                    <Image
                                        src="/lama.png"
                                        width={30}
                                        height={30}
                                        className={` dark:invert  size-auto`}
                                        alt="#"
                                    />
                                </div>
                                <div >
                                    <TbEdit className="cursor-pointer " title="New Chat" onClick={() => { router.push('/') }} size={27} />
                                </div>
                            </div>
                        </SidebarHeader>
                        <SidebarContent className="bg-background">
                            <div className="p-1 w-full">
                                <div className={`flex flex-col gap-1  w-full`}>
                                    {Charts.length > 0 && Charts.map((item, index) => {
                                        return <div className="flex gap-1 items-center justify-between bg-background text-foreground hover:bg-accent hover:text-accent-foreground p-2 rounded-md" key={index}>
                                            <div className="cursor-pointer w-4/5" onClick={(e) => { e.preventDefault(), router.push(`/c/${item._id}`) }}>
                                                <div onKeyDown={(e) => keydown(e, index, item._id)} ref={(chart) => (chatRef.current[index] = chart)} className="overflow-hidden truncate w-full text-start rounded-sm " >{item.content}</div>
                                            </div>
                                            <OllamaDropD chatid={item._id} id={chatid} index={index} refference={chatRef} />
                                        </div>
                                    })}
                                </div>
                            </div>
                        </SidebarContent>
                        <SidebarFooter className="bg-background">
                            <div className="flex justify-center items-center p-1 border-t-border border-t-2 py-2 ">
                                <OllamaFooter chatid={chatid} />
                            </div>
                        </SidebarFooter>
                    </Sidebar>
                    <SidebarInset className="flex flex-col">
                        <header className="flex h-14 items-center justify-between border-b px-2 lg:h-[60px]">
                            <div className='flex justify-between  items-center px-2'>
                                <SidebarTrigger />
                                <div className="flex gap-3 justify-center items-center">
                                    <ComboboxDemo svalue={currentselectvalue} />
                                </div>
                            </div>
                            <OllamaHeader />
                        </header>
                        <main className="flex-1 overflow-auto ">
                            <div className=" py-3 px-10 flex justify-center items-center ">
                                <div className="w-full h-full pb-16 ">
                                    <div className='m-auto w-3/4  '>
                                        {!chatid && FinalResponse.length === 0 &&
                                            <div className='flex justify-center items-center'>
                                                <Image
                                                    src="/ollama.png"
                                                    width={385}
                                                    height={385}
                                                    alt="#"
                                                    priority={true}
                                                    className='md:size-auto size-[50vw]'
                                                />
                                            </div>}
                                        <div className='flex flex-col gap-10 '>
                                            {FinalResponse.map((item, index) => {
                                                return <div className=' flex flex-col min-h-10 ' key={index}>
                                                    <div>
                                                        {item.role === 'user' &&
                                                            <div className=''>
                                                                <div className='flex items-start justify-end gap-3 '>
                                                                    <span className=' md:text-base text-xs  text-left relative top-4 max-w-xl rounded-l-2xl rounded-br-2xl rounded-tr-sm break-words text-foreground bg-secondary  px-5 py-2 whitespace-pre-wrap select-text' >{item.content}
                                                                    </span>
                                                                    <span className=' md:text-lg text-xs text-foreground bg-secondary md:pb-1.5 flex items-center justify-center rounded-full md:w-10 md:h-10 w-7 h-7 overflow-hidden font-bold '>{name.charAt(0)}</span>
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
                                                                className={` dark:invert  size-auto`}
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
                                                                className={` dark:invert size-auto`}
                                                                alt="#"
                                                            />
                                                            <div className=' max-w-3xl break-words overflow-y-hidden overflow-x-auto  '>
                                                                <div className=' leading-3 pb-3 select-text'>
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
                                    <Textarea ref={textarea} onKeyDown={handleKeyDown} onChange={() => { textChange() }} autoFocus placeholder={`${currentselectvalue ? `Message to ${currentselectvalue}` : ''}`} id="message" name="chat" rows="1" className='placeholder:text-xs sm:placeholder:text-sm' disabled={!currentselectvalue} />
                                    <div className="flex justify-center items-center gap-3">
                                        <Button variant={generating !== '' ? "gen" : "send"} ref={buttonRef} size={generating !== '' ? "gen" : "send"} disabled={generating !== '' ? false : !currentselectvalue || !button} onClick={() => { handleChatButtonClick() }} >
                                            {generating === 'funload' || generating === 'gen' ? <FaSquare className='size-3' /> : <IoMdArrowRoundUp className='size-5' />}
                                        </Button>
                                    </div>
                                </div>
                                <div className=" w-2/3 h-[23.7px] fixed bottom-0 bg-background"></div>
                            </div>
                        </main>
                    </SidebarInset>
                </SidebarProvider>
            </div>
        </>
    )
});

export default OllamaPage;

OllamaPage.displayName = 'OllamaPage';