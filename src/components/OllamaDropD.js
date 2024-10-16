'use client'
import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { BsThreeDots } from "react-icons/bs";
import { RiDeleteBinLine } from "react-icons/ri";
import { LuPencil } from "react-icons/lu";
import { DeleteChat } from "@/DbHandler/DbHandler";
import { useRouter } from 'next/navigation'


export const OllamaDropD = React.forwardRef(({ chatid, id, refference, index }, ref) => {
    const router = useRouter()
    const [isOpen, setIsOpen] = useState(false);

    const handleDelete = async () => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser) {
            let mongourl = currentUser[0].MongoStringUrl
            let cid = currentUser[0]._id
            await DeleteChat(mongourl, chatid, cid)
            let chats = currentUser[0].chats
            for (let i = 0; i < chats.length; i++) {
                if (chats[i] === chatid) {
                    chats.splice(i, 1)
                }
            }
            localStorage.setItem('currentUser', JSON.stringify([{ ...currentUser[0], chats: chats }]))
            if (chatid === id) {
                router.push('/')
            }
            else if (chatid !== id) {
                if (chatid && id) {
                    router.push(`/d/${id}`)
                }
                else {
                    window.location.reload()
                }
            }
            else {
                window.location.reload()
            }
        }
        setIsOpen(false)
    }
    const handleEdit = async () => {
        if (refference.current) {
            const divElement = refference.current[index];
            divElement.contentEditable = true;
            setTimeout(() => {
                divElement.focus();
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(divElement);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }, 0);
            divElement.onblur = () => {
                divElement.contentEditable = false
            }
        }
        setIsOpen(false)
    }
    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <div className=" h-full flex justify-center items-center ">
                    <BsThreeDots size={18} className="cursor-pointer h-full opacity-50 hover:opacity-100 " onClick={(e) => { e.stopPropagation(), e.preventDefault() }} />
                </div>

            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-[2px]  rounded-2xl relative left-10 w-auto flex flex-col gap-1 p-2 py-3 bg text-foreground">
                <Button variant="outline" className='p-4 py-5 flex items-center gap-3 justify-start  border-none  shadow-none text-sm  font-bold  ' size={'sm'} onClick={() => handleEdit()}>
                    <div>
                        <LuPencil size={16} />
                    </div>
                    <div >Edit</div>
                </Button>
                <Button variant="outline" className='p-4 py-5 flex items-center gap-3 justify-start  border-none  shadow-none text-sm hover:text-red-700 text-red-800 font-bold ' size={'sm'} onClick={() => handleDelete()}>
                    <div>
                        <RiDeleteBinLine size={16} />
                    </div>
                    <div >Delete</div>
                </Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
})


OllamaDropD.displayName = 'OllamaDropD';

