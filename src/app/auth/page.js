'use client'
import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { DialogDemo } from '@/components/Storagebtn';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { BsEyeFill } from "react-icons/bs";
import { RiEyeCloseFill } from "react-icons/ri";
import { Toaster, toast } from 'sonner'
import Link from 'next/link';
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from 'next/navigation'
import { SignUp } from '@/DbHandler/DbHandler';
import { LogIn } from '@/DbHandler/DbHandler';
import { currentUser } from '@/DbHandler/DbHandler';
import { login } from '@/lib/features/Login/Login';
import SuccessCard from '@/components/ui/LoginSucess';




export default function Auth() {

    const router = useRouter()

    const [isLogin, setIsLogin] = useState(true);
    const [Name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setsuccess] = useState(false);

    const passwordRef = useRef()
    const confirmpasswordRef = useRef()

    const handleToggle = () => {
        setIsLogin(!isLogin);
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLogin) {
            let data = await LogIn(mongostrurl, email, password)
            if (data === 'Success') {
                toast.success('Login success', {
                    position: 'top-center',
                })
                let current = await currentUser(mongostrurl, email)
                if (current) {
                    localStorage.setItem('currentUser', JSON.stringify(current))
                }
                dispatch(login(true))
                setsuccess(true)
                setTimeout(() => {
                    router.push('/')
                }, 1000);
            } else if (data === 'Invalid credentials') {
                toast.error(data, {
                    position: 'top-center',
                })
            } else {
                toast.error(data, {
                    position: 'top-center',
                })
            }
        } else {
            if (password === confirmPassword) {
                let data = await SignUp(mongostrurl, Name, email, password)
                if (data === "Email already exists") {
                    toast.error('Email already exists', {
                        position: 'top-center',
                    })
                } else if (data === "Success") {
                    toast.success('Signup success', {
                        position: 'top-center',
                    })
                    setIsLogin(!isLogin)
                }  else {
                    toast.error(data, {
                        position: 'top-center',
                    })
                }
            }
        }
    }
    const mongostrurl = useAppSelector((state) => state.mongostrurl.MongoStringUrl)
    const dispatch = useAppDispatch()
    return (
        <div className={`flex justify-center items-center h-screen bg-background  select-none`}>
            <Toaster richColors />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className='font-bold text-2xl'>{isLogin ? 'Login' : 'Signup'}</CardTitle>
                    <CardDescription>
                        {isLogin ? 'Enter your credentials to login' : 'Create a new account'}
                    </CardDescription>
                </CardHeader>
                <div className='flex justify-center '>
                    <DialogDemo />
                    {success && <SuccessCard />}
                </div>
                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {!isLogin && (
                            <div className="mb-4">
                                <Label htmlFor="Name">Name</Label>
                                <Input id="name" type="Name" value={Name} onChange={(e) => setName(e.target.value)} required />
                            </div>
                        )}
                        <div className="mb-4">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" value={email} placeholder="m@gmail.com" onChange={(e) => setEmail(e.target.value)} required type="email" />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="password">Password</Label>
                            <div className='flex justify-center items-center relative'>
                                <Input ref={passwordRef} id="password" type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required />

                                {passwordRef.current?.value.length > 0 && showPassword && <BsEyeFill className='absolute right-3 cursor-pointer select-none' onClick={(e) => { e.preventDefault(), setShowPassword(!showPassword) }} />}

                                {passwordRef.current?.value.length > 0 && !showPassword && <RiEyeCloseFill className='absolute right-3 cursor-pointer select-none' onClick={(e) => { e.preventDefault(), setShowPassword(!showPassword) }} />}
                            </div>
                        </div>
                        {!isLogin && (
                            <div className="mb-4">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className='flex justify-center items-center relative'>
                                    <Input ref={confirmpasswordRef} id="confirmPassword" type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />

                                    {confirmpasswordRef.current?.value.length > 0 && showPassword && <BsEyeFill className='absolute right-3 cursor-pointer select-none' onClick={(e) => { e.preventDefault(), setShowPassword(!showPassword) }} />}

                                    {confirmpasswordRef.current?.value.length > 0 && !showPassword && <RiEyeCloseFill className='absolute right-3 cursor-pointer select-none' onClick={(e) => { e.preventDefault(), setShowPassword(!showPassword) }} />}
                                </div>
                                {passwordRef.current?.value !== confirmpasswordRef.current?.value && passwordRef.current?.value.length > 0 && confirmpasswordRef.current?.value.length > 0 && (
                                    <p className="text-red-500">Passwords do not match.</p>
                                )}
                                <div className="flex gap-1.5 items-center mt-6 text-sm ml-1">
                                    <Checkbox required />
                                    <span>
                                        I accept the <Link href="/terms" className="underline text-blue-700 font-bold">terms and conditions</Link>
                                    </span>
                                </div>
                            </div>
                        )}
                        <Button variant='default' className='w-full' type="submit">{isLogin ? 'Login' : 'Signup'}</Button>
                    </form>
                </CardContent>
                <CardFooter>
                    <p>
                        {isLogin ? 'Don\'t have an account?' : 'Already have an account?'}
                        <Button variant="link" className='text-blue-600' onClick={handleToggle}>
                            {isLogin ? 'Signup' : 'Login'}
                        </Button>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}


