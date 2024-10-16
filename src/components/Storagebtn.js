'use client'
import { useEffect, useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import Link from "next/link"
import { useAppSelector, useAppDispatch } from "@/lib/hooks"
import { mongostringurl } from "@/lib/features/MongoDbCString/MongoString"
import { BsEyeFill } from "react-icons/bs";
import { RiEyeCloseFill } from "react-icons/ri";



export function DialogDemo() {
  const MongoStringurl = useAppSelector((state) => state.mongostrurl.MongoStringUrl)
  
  const [mongourl, setmongourl] = useState('')
  const [password, setpassword] = useState(true)

  const mongoinput = useRef()

  useEffect(() => {
    setmongourl(MongoStringurl)
  }, [MongoStringurl])
  const dispatch = useAppDispatch()
  const handleSubmit = (e) => {
    e.preventDefault()
    dispatch(mongostringurl(mongourl))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">MongoDB Settings</Button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-[425px] text-foreground `}>
        <form onSubmit={handleSubmit} >
          <DialogHeader className='pb-5'>
            <DialogTitle className="text-2xl font-bold">Choose Storage</DialogTitle>
            <DialogDescription>Select the storage you want to use. You can choose between different storage options such as Local Storage or MongoDB.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-6 flex-col pb-6">
            <div className=" gap-4 flex flex-col">
              <Label htmlFor="url" className="">
                MongoDB Connection String
              </Label>
              <div className="flex justify-center items-center">
                <Input ref={mongoinput} id="url" type={password ? 'Password' : 'text'} value={mongourl} placeholder="mongodb://localhost:27017" className="pr-8 " onChange={(e) => { setmongourl(e.target.value) }} required />
                {password ? <RiEyeCloseFill className="absolute right-8 cursor-pointer select-none" onClick={() => { setpassword(false) }} /> : <BsEyeFill className="select-none absolute right-8 cursor-pointer" onClick={() => { setpassword(true) }} />}
              </div>
            </div>
          </div>
          <div className="flex gap-1.5 items-center text-sm mb-3 ml-1">
            <Checkbox required />
            <span>
              I accept the <Link href="/terms" className="underline text-blue-700 font-bold">terms and conditions</Link>
            </span>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="submit" className="w-full">Save changes</Button>
            </DialogClose>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
