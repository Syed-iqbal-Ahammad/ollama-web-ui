"use client";
import OllamaPage from "@/components/OllamaPage";
import { useRouter } from 'next/navigation';

const Page = ({ params }) => {
  let currentUser = null;
  const router = useRouter();
  if (typeof window !== 'undefined') {
    currentUser = localStorage.getItem('currentUser');
  }
  if (typeof window !== 'undefined' && !currentUser) {
    router.push('/auth');
  }


  return (
    <main className={`w-[100vw] h-[100vh]`}>
      <OllamaPage chatid={params?.chatid} />
    </main>
  );
};

export default Page;