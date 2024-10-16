'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

const Page = ({ params }) => {
    const router = useRouter()
    useEffect(() => {
        router.push(`/c/${params.chatid}`)
    },[params.chatid,router] )
    return (
        <>
            Redirecting...
        </>
    )
}
export default Page
