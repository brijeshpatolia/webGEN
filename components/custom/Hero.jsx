'use client';

import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailcontext';
import { ArrowRight, Link } from 'lucide-react';
import React, { useContext, useState } from 'react';
import LoginDialog from './LoginDialog';

const Hero = () => {
    const [userInput, setUserInput] = useState('');
    const { messages, setMessages } = useContext(MessagesContext);
    const [open, setOpen] = useState(false);
    const suggestions = [
        'Create TODO App in React',
        'Create Budget Track App',
        'Create Gym Management Portal Dashboard',
        'Create VITE app',
        'Create Login Signup Screen',
    ];
    const { userDetail } = useContext(UserDetailContext);

    const onGenerate = (input) => {
        if (!userDetail?.name) {
            setOpen(true);
            return;
        }
        setMessages((prevMessages) => [
            ...prevMessages,
            {
                role: 'user',
                content: input,
            },
        ]);
    };

    const handleSuggestionClick = (suggestion) => {
        setUserInput(suggestion);
    };

    return (
        <div className="flex flex-col items-center mt-36 xl:mt-52 gap-2">
            <h2 className="font-bold text-4xl">What do you want to build?</h2>
            <p className="text-gray-400 font-medium">
                Prompt, run, edit, and deploy full-stack web apps.
            </p>

            <div className="p-5 border border-gray-700 rounded-xl max-w-xl w-full mt-3 bg-[#141414] shadow-lg">
                <div className="flex gap-2">
                    <textarea
                        placeholder="What do you want to build?"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        className="outline-none bg-transparent w-full h-32 max-h-56 resize-none text-gray-300"
                        aria-label="User Input"
                    />
                    {userInput && (
                        <ArrowRight
                            onClick={() => onGenerate(userInput)}
                            className="bg-blue-500 p-2 h-10 w-10 rounded-md cursor-pointer"
                            aria-label="Generate"
                        />
                    )}
                </div>
                <div>
                    <Link className="h-5 w-5" aria-label="Link Icon" />
                </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-8 items-center justify-center max-w-2xl">
                {suggestions.map((suggestion, index) => (
                    <h2
                        key={index}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="p-1 px-2 border rounded-full text-sm text-gray-400 hover:text-white cursor-pointer"
                    >
                        {suggestion}
                    </h2>
                ))}
            </div>

            <LoginDialog open={open} close={(v)=>setOpen(v)} />
        </div>
    );
};

export default Hero;