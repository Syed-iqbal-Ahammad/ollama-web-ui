'use client'
import { Button } from "./ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { DeleteChat } from "@/DbHandler/DbHandler"
import { Toaster, toast } from 'sonner';
import { DeleteUser } from "@/DbHandler/DbHandler"

export function OllamaHeader() {
    const [name, setname] = useState('')
    const [isOpen, setIsOpen] = useState(false);
    useEffect(() => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            setname(currentUser[0].name)
        }
    }, [])
    const handleDelete = async () => {
        let currentUser = JSON.parse(localStorage.getItem('currentUser'))
        if (currentUser) {
            let mongourl = currentUser[0].MongoStringUrl
            let cid = currentUser[0]._id
            let chats = currentUser[0].chats
            for (let i = 0; i < chats.length; i++) {
                var m = await DeleteChat(mongourl, chats[i], cid)
                if (m !== 'Success') {
                    toast.error(m, {
                        position: 'top-center',
                    })
                }
            }
            let d = await DeleteUser(mongourl, cid)
            if (d !== 'Success') {
                toast.error(d, {
                    position: 'top-center',
                })
            }
            if (m === 'Success' && d === 'Success') {
                toast.success('User deleted successfully', {
                    position: 'top-center',
                })
            }
            localStorage.removeItem('currentUser')
            window.location.reload()
        }
        setIsOpen(false)
    }
    const handleLogout = async () => {
        localStorage.removeItem('currentUser')
        toast.success('Logged out successfully', {
            position: 'top-center',
        })
        window.location.reload()
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <div className='text-foreground bg-secondary cursor-pointer flex items-center justify-center rounded-full w-10 h-10 overflow-hidden font-bold '>{name.charAt(0)}</div>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" flex flex-col gap-2 px-3 py-2 bg-background">
                <Toaster richColors />
                <Button variant="secondary" onClick={() => handleLogout()}>Log Out</Button>
                <Button variant="destructive" onClick={() => handleDelete()}>Delete User</Button>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
