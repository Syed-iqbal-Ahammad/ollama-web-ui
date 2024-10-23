import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react";
import { MdOutlineFileDownload } from "react-icons/md";
import Loader from "./ui/Loader"
import ToastSonner from "./ToastSonner";
import { Toaster, toast } from "sonner"

export function Pullmodel({ setIsOpen }) {
    const [model, setmodel] = useState('')
    const [message, setmessage] = useState('')
    const [Pulling, setPulling] = useState(false)
    const [msgType, setmsgType] = useState("")
    const handleClick = async () => {
        if (model.length > 0) {
            setmsgType('');
            setmessage('');
            setPulling(true);
            let temp = ''
            try {
                let c = JSON.parse(localStorage.getItem('currentUser'));
                if (c) {
                    const res = await fetch('/api/pull', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            model: model,
                            stream: true,
                            OLLAMA_HOST: c[0].OLLAMA_HOST,
                        }),
                    });
                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) break;
                        const chunk = decoder.decode(value);
                        const jsonObjects = chunk.split(/\n/).filter(Boolean);
                        jsonObjects.forEach((jsonObject) => {
                            try {
                                const parsedObject = JSON.parse(jsonObject);
                                if (temp !== parsedObject.status) {
                                    if (parsedObject.status !== undefined && parsedObject.status !== 'success' ) {
                                        toast.success(parsedObject.status, {
                                            position: 'top-center',
                                        })
                                        setIsOpen(false)
                                    } else if (parsedObject.status === 'success') {
                                        toast.success(`successfully pulled ${model}`, {
                                            position: 'top-center',
                                        })
                                        setIsOpen(false)
                                    } else {
                                        toast.error(`Invalid model name or failed to pull ${model}`, {
                                            position: 'top-center',
                                        })
                                    }
                                    setIsOpen(false)
                                }
                                temp = parsedObject.status
                            } catch (error) {
                                console.error('Error parsing JSON', error);
                                setIsOpen(false)
                            }
                        });
                    }
                    setPulling(false);
                    setIsOpen(false)
                }
            } catch (error) {
                setPulling(false);
                setIsOpen(false)
                setmsgType('error');
                setmessage('An error occurred while pulling the model');
            }
        } else {
            setPulling(false);
            setIsOpen(false)
            setmsgType('warning');
            setmessage('Please enter a model name');
        }
    };


    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleClick()
        }
    };
    return (
        <Dialog>
            {message.length > 0 && <ToastSonner msg={message} type={'top-center'} msgtype={msgType} />}
            <Toaster richColors />
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex justify-start items-center gap-3 border-none shadow-none">
                    <div>
                        <MdOutlineFileDownload size={20} />
                    </div>
                    <div>
                        Pull Model
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent setIsOpen={setIsOpen} className="sm:max-w-[425px] ">
                <DialogHeader className="flex flex-col gap-1">
                    <DialogTitle className="text-2xl">Pull Model</DialogTitle>
                    <DialogDescription className="text-xs">
                        This will pull the model from the ollama.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col gap-2 py-3">
                    <div className="flex flex-col gap-4">
                        <Label htmlFor="name" className="text-left">
                            Model Name
                        </Label>
                        <Input id="name" value={model} onKeyDown={handleKeyDown} onChange={(e) => { setmodel(e.target.value) }} placeholder="Lama3" className="col-span-3" />
                    </div>
                    <div className="text-xs ">Check the <a className="text-blue-500 hover:underline font-bold hover:text-blue-700" target="_blank" href="https://ollama.com/library">library</a> for a list of available models.</div>
                </div>
                <DialogFooter>
                    <DialogClose asChild >
                        <Button onClick={() => { handleClick() }} className="w-full h-10 font-bold">
                            {!Pulling && 'Pull Model'}
                            {Pulling && <Loader />}
                        </Button>
                    </DialogClose>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}
