'use client';

import { MessagesContext } from '@/context/MessagesContext';
import { UserDetailContext } from '@/context/UserDetailcontext';
import { api } from '@/convex/_generated/api';
import Prompt from '@/data/Prompt';
import axios from 'axios';

import { useConvex, useMutation } from 'convex/react';
import { ArrowRight, Link, Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react';

const ChatView = () => {
    const { id } = useParams(); // Get workspace ID from route params
    const convex = useConvex();
    const [userInput, setUserInput] = useState('');
    const { userDetail } = useContext(UserDetailContext);
    const { messages, setMessages } = useContext(MessagesContext); // Assuming MessagesContext is available in the parent component
    const [loading, setLoading] = useState(false);
    const UpdateMessages = useMutation(api.workspace.UpdateMessages);

    const GetWorkspaceData = async () => {
        try {
            console.log("Fetching workspace with ID:", id);
            const result = await convex.query(api.workspace.GetWorkspace, {
                workspaceId: id,
            });
            setMessages(Array.isArray(result.messages) ? result.messages : []); // Ensure messages is an array
            console.log("Workspace Data:", result);
        } catch (error) {
            console.error("Error fetching workspace data:", error);
        }
    };

    useEffect(() => {
        if (id) {
            GetWorkspaceData();
        } else {
            console.error("Invalid workspace ID:", id);
        }
    }, [id]);

    useEffect(() => {
        if (Array.isArray(messages) && messages.length > 0) {
            const role = messages[messages.length - 1].role;
            if (role === 'user') {
                GetAiResponse();
            }
        }
    }, [messages]);

    const GetAiResponse = async () => {
        setLoading(true);
        try {
            const PROMPT = JSON.stringify(messages || []) + Prompt.CHAT_PROMPT;
            const result = await axios.post('/api/ai-chat', { prompt: PROMPT });
            console.log(result.data.result);
            const newMessages = [...(Array.isArray(messages) ? messages : []), { role: 'assistant', content: result.data.result }];
            setMessages(newMessages);
            await UpdateMessages({ workspaceId: id, messages: newMessages });
        } catch (error) {
            console.error("Error getting AI response:", error);
        } finally {
            setLoading(false);
        }
    };

    const onGenerate = async (input) => {
        setMessages((prevMessages) => [...(Array.isArray(prevMessages) ? prevMessages : []), { role: 'user', content: input }]);
    };

    return (
        <div className='relative h-[85vh] flex flex-col'>
            <div className='flex-1 overflow-y-scroll no-scrollbar'>
                {Array.isArray(messages) && messages.map((msg, index) => (
                    <div key={index}
                        className='p-3 rounded-lg mb-2 bg-[#222222] flex gap-2 items-start'>
                        {msg?.role === 'user' && <Image src={userDetail?.picture} alt="User" width={35} height={35} className='rounded-full' />}
                        <h2>{msg.content}</h2>
                    </div>
                ))}
                {loading && (
                    <div className='p-3 rounded-lg mb-2 bg-[#222222] flex gap-2 items-start'>
                        <Loader2Icon className='animate-spin' />
                        <h2>Generating response...</h2>
                    </div>
                )}
            </div>
            <div className="p-5 border border-[#ED9030] rounded-xl max-w-xl w-full mt-3 bg-[#141414] shadow-lg">
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
        </div>
    );
};

export default ChatView;
