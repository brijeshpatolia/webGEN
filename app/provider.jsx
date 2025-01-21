"use client"

import React, { useState } from 'react'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import Header from '@/components/custom/Header'
import { MessagesContext } from '@/context/MessagesContext'
import { UserDetailContext } from '@/context/UserDetailcontext'
import { GoogleOAuthProvider } from '@react-oauth/google'
const provider = ({ children }) => {
    const [messages, setMessages] = useState()
    const [userDetail, setUserDetail] = useState()
    return (
        <div>
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
                <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
                    <MessagesContext.Provider value={{ messages, setMessages }}>
                        <NextThemesProvider defaultTheme="dark"
                            attribute="class"
                            enableSystem
                            disableTransitionOnChange >
                            <Header />
                            {children}
                        </NextThemesProvider>
                    </MessagesContext.Provider>
                </UserDetailContext.Provider>
            </GoogleOAuthProvider>
        </div>
    )
}

export default provider