'use client'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { Setting } from "./Setting";
import { Pullmodel } from "./Pullmodel";
import { LuFileClock } from "react-icons/lu";
import { useRouter } from 'next/navigation'

export function OllamaFooter({ chatid }) {
    const router = useRouter()
    const [name, setname] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setname(currentUser[0].name)
        }
    }, [])

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className=" w-full h-[90%] flex justify-start rounded-2xl gap-2 border-none shadow-none overflow-hidden">
                    <div className=" bg-secondary p-5 w-6 h-6 rounded-full flex justify-center items-center">{name.charAt(0)}</div>
                    <div className="overflow-hidden truncate w-36 text-start ">{name}</div>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 flex flex-col gap-1 p-3 bg-background">
                <Button variant="outline" className="w-full flex justify-start items-center gap-3 border-none shadow-none" onClick={() => { router.push("/temp"), setIsOpen(false) }}>
                    <div><LuFileClock size={16} /></div>
                    <div>Temp Chat</div>
                </Button>
                <Pullmodel setIsOpen={setIsOpen} />
                <Setting chatid={chatid} setIsOpen={setIsOpen} name={name} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
