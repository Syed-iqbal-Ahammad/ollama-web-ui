"use client";
import OllamaPage from "@/components/OllamaPage";
import { useRouter } from 'next/navigation'

const Page = () => {

  let currentUser = null;
  if (typeof window !== 'undefined') {
    currentUser = localStorage.getItem('currentUser');
  }
  const router = useRouter()


  if (typeof window !== 'undefined' && !currentUser) {
    router.push('/auth')
  }
  return (
    <main className={`w-[100vw] h-[100vh]`} >
      <OllamaPage />
    </main>
  );
}


export default Page
