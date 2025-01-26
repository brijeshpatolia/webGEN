import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import axios from 'axios'
import { UserDetailContext } from '@/context/UserDetailcontext'
import { useMutation } from 'convex/react'

import { api } from '@/convex/_generated/api'
import uuid4 from 'uuid4'



function LoginDialog({open, close}) {
    const {userDetail, setUserDetail} = useContext(UserDetailContext)
    const createUser = useMutation(api.users.createUser);
    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: 'Bearer ' + tokenResponse?.access_token,
                },
            })
            console.log(userInfo);
            const user = userInfo.data;
            await createUser ({
                name: user?.name,
                email: user?.email,
                picture: user?.picture,
                uid: uuid4()
            })
            if(typeof window !== 'undefined') {
                localStorage.setItem('user', JSON.stringify(user))
            }
            setUserDetail(userInfo?.data)
            
           
            close(false)
        }
    })
    
    return (
        <Dialog open={open} onOpenChange={close}>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription className = "flex flex-col items-center justify-center">
                        <div>
                            <h2 className='font-bold text-2xl text-white text-center'>
                                continue with edith 2.0
                            </h2>
                            <p className='mt-2 text-gray-400 text-center'>
                                To use Edith 2.0, you must login into an existing account or create one.
                            </p>
                            <div className='flex justify-center mt-4'>
                                <Button className='bg-blue-500 text-white' 
                                onClick={googleLogin}> 
                                    Sign in with Google
                                </Button>
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    )
}

export default LoginDialog
