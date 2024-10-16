'use client'
import TempChat from "@/components/TempChat"
import { useAppSelector } from "@/lib/hooks";
const page = () => {
    return (
        <>
            <div className={`w-[100vw] h-[100vh] `}>
                <TempChat />
            </div>
        </>
    )
}

export default page




