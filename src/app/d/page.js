'use client'
import { useRouter } from 'next/navigation'
import { useEffect } from "react"

const Page = () => {
    const router = useRouter()
    useEffect(() => {
        router.push(`/`)
    }, router)
    return (
        <>
            Redirecting...
        </>
    )
}
export default Page
