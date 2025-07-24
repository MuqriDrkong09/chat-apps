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
        <div className={"p-4 max-w-md mx-auto"}>
            <div className={"bg-gray-100 p-4 rounded h-96 overflow-y-auto"}>
                {messages.map((msg) => (
                    <div key={msg.id} className={`my-2 ${msg.sender === 'me' ? 'text-right' : 'text-left'}`}>
                        <span className={"inline-block bg-blue-200 px-3 py-1 rounded"}>
                            {msg.text}
                        </span>
                    </div>
                ))}
                <div ref={bottomRef} />
            </div>
            <div className={"flex mt-4"}>
                <input
                    type={'text'}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    className={"flex-grow border px-2 py-1 rounded-1"}
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