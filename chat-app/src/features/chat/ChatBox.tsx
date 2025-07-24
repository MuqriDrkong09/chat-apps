import React, { useState, useRef, useEffect} from "react";
import {useAppDispatch, useAppSelector} from "../../app/hooks.ts";
import { sendMessage } from "./chatSlice.ts";
import { v4 as uuidv4 } from 'uuid';
import type { Message } from "../../types.ts";

const ChatBox: React.FC = () => {
    const [input, setInput] = useState('');
    const messages = useAppSelector((state) => state.chat.messages)
    const dispatch = useAppDispatch();
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const saved = localStorage.getItem("chatMessages");
        if (saved) {
            const parsed: Message[] = JSON.parse(saved);
            parsed.forEach((msg) => dispatch(sendMessage(msg)));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("chatMessages", JSON.stringify(messages));
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    const handleSend = () => {
        if (!input.trim()) return;
        const newMessage: Message = {
            id: uuidv4(),
            text: input,
            timestamp: new Date().toISOString(),
            sender: 'me',
        };
        dispatch(sendMessage(newMessage));
        setInput('');

        setTimeout(() => {
            const botReply: Message = {
                id: uuidv4(),
                text: generateBotReply(input),
                timestamp: new Date().toISOString(),
                sender: 'bot',
            }
            dispatch(sendMessage(botReply));
        }, 1000)
    }

    const generateBotReply = (userInput: string) => {
        if (userInput.toLowerCase().includes('hello')) {
            return 'Hello! How can I assist you today?';
        }
        if (userInput.toLowerCase().includes('help')) {
            return 'Sure! What do you need help with?';
        }
        return 'I am a bot, and I’m here to help! 😊';
    }

    return (
        <div className={"w-full max-w-sm mx-auto p-4"}>
            <div className={"bg-gray-100 p-4 rounded h-96 overflow-y-auto"}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`my-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                        <span className={`inline-block bg-blue-200 px-3 py-1 rounded max-w-[80%] break-words whitespace-pre-wrap
                          ${msg.sender === 'me' ? 'bg-blue-500 text-white' : `bg-gray-300 text-black`}`}
                        >
                            {msg.text}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className={"flex flex-col sm:flex-row gap-2 mt-4"}>
                <input
                    type={'text'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className={"w-full border px-2 py-2 rounded sm:rounded-1 sm:rounded-none focus:outline-none focus:ring-2 focus:ring-blue-400"}
                />
                <button
                    onClick={handleSend}
                    className="bg-blue-500 text-white px-4 py-1 rounded-r hover:bg-blue-600"
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatBox;