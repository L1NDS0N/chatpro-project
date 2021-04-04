import React, { FormEvent, useState } from 'react';
import { useSocket } from '../../contexts/SocketContext';
import ws from '../../modules/SocketConnection.module';
import './styles.css';

interface Message {
    readonly id?: string;
    userId?: string;
    name?: string;
    message: string;
    createdAt?: string;
}

const Chat: React.FC = () => {
    const socket: SocketIOClient.Socket = ws;
    const { newUser } = useSocket();
    const [message, setMessage] = useState<string>();
    const [displayMessages, setDisplayMessages] = useState<Message[]>([]);
    const [messageBody, setMessageBody] = useState({} as Message);

    async function handleTyping(e: any) {
        const { value } = e.currentTarget;
        setMessage(value);
        setMessageBody({ userId: newUser.id, message: value });
    }

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const element = document.getElementById('inputMessages');
        element?.focus();

        if (
            typeof message === 'string' &&
            (message != null || undefined || '')
        ) {
            setMessageBody({
                userId: newUser.id,
                message,
            });

            setDisplayMessages([...displayMessages, messageBody]);
            socket.emit('sendMessage', messageBody);
            setMessage('');
        }
    }

    socket.on('receivedMessage', (response: any) => {
        setDisplayMessages([
            ...displayMessages,
            {
                id: response.id,
                name: response.user_id,
                message: response.message,
            },
        ]);
    });

    return (
        <>
            <form id="chat" onSubmit={handleSubmit}>
                <main className="messages">
                    {displayMessages.map(display => (
                        <div className="message" key={display.id}>
                            <strong>
                                {display.name ? display.name : 'Eu'}
                            </strong>
                            : {display.message}
                        </div>
                    ))}
                </main>
                <input
                    id="inputMessages"
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    placeholder="Insira sua mensagem"
                    required
                />
                <button type="submit">Enviar</button>
            </form>
        </>
    );
};
export default Chat;
