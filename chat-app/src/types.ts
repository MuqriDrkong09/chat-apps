export interface Message {
    id: string;
    text: string;
    timestamp: string;
    sender: 'me' | 'bot';
}
