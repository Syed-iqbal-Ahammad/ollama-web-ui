"use client"
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
import { IoIosSettings } from "react-icons/io";
import { ModeToggle } from "./Mode";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation'
import { EditUserName } from "@/DbHandler/DbHandler"

export function Setting({ name, setIsOpen, chatid }) {
    let Router = useRouter()
    const [value, setvalue] = useState()
    useEffect(() => {
        setvalue(name)
    }, [name])

    const handleChange = (e) => {
        setvalue(e.target.value)
    }
    const handleClick = async () => {
        let c = JSON.parse(localStorage.getItem('currentUser'))
        if (value !== name) {
            localStorage.setItem('currentUser', JSON.stringify([{ ...c[0], name: value }]))
            await EditUserName(c[0].MongoStringUrl, c[0]._id, value)
            if (chatid) {
                Router.push(`/d/${chatid}`)
            }
            else {
                Router.push(`/d`)
            }
        }
        setIsOpen(false)
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full flex justify-start items-center gap-3 border-none  shadow-none">
                    <div>
                        <IoIosSettings size={20} />
                    </div>
                    <div>
                        Setting
                    </div>
                </Button>
            </DialogTrigger>
            <DialogContent setIsOpen={setIsOpen} className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit profile</DialogTitle>
                    <DialogDescription>
                        Make changes to your profile here. Click save when you&apos;re done.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col justify-center items-center gap-4 py-6">
                    <div className="flex justify-center items-center gap-3 w-full">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={value} onKeyDown={(e) => { e.key === 'Enter' && handleClick() }} onChange={(e) => handleChange(e)} placeholder="Name" className="col-span-3" />
                    </div>
                    <div className="flex gap-3 justify-center items-center w-full ">
                        <div>Theme</div>
                        <ModeToggle />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button onClick={() => { handleClick() }} className="w-full">Save changes</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
