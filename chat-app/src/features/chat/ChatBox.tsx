import React, { useState, useRef, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type { RootState, AppDispatch} from "../../app/store.ts";
import { sendMessage} from "./chatSlice.ts";
import type {Message} from "./chatSlice.ts";

const ChatBox: React.FC = () => {
    const [input, setInput] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const messages = useSelector((state: RootState) => state.chat.messages)
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = () => {
        const newMessage: Message = {
            text: input,
            timestamp: new Date().toISOString(),
        };
        dispatch(sendMessage(newMessage));
        setInput('');
    }

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div className="max-w-md mx-auto p-4 border rounded shadow space-y-4">
            <h1 className={"text-xl font-bold text-center"}>Simple Chat</h1>
            <div className={"h-64 overflow-y-auto border p-2 bg-gray-100 rounded"}>
                {messages.map((msg, index) => (
                    <div key={index} className="mb-2">
            <span className="text-sm text-gray-600">
              {new Date(msg.timestamp).toLocaleTimeString()}:
            </span>
                        <p>{msg.text}</p>
                    </div>
                ))}
                <div ref={messagesEndRef}></div>
            </div>
            <div className={"flex gap-2"}>
                <input
                type="text"
                className={"flex-1 border p-2 rounded"}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                <button onClick={handleSend} className={"bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"}>
                    Send
                </button>
            </div>
        </div>
    )
}

export default ChatBox;