import React, { FormEvent, useEffect, useState } from 'react';
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
    const [messageBody, setMessageBody] = useState({
        userId: newUser.id,
        message,
    } as Message);

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const element = document.getElementById('inputMessages');
        element?.focus();

        if (message !== '' && message !== null && message !== undefined) {
            setMessageBody({
                userId: newUser.id,
                message,
            });

            console.log({ messageBody });
            socket.emit('sendMessage', messageBody);
            setMessage('');
        }
    }

    socket.on('receivedMessage', (response: any) => {
        console.log('mensagem recebida do backend:', response);
        setDisplayMessages([
            ...displayMessages,
            { id: response.id, name: response.id, message: response.message },
        ]);
    });

    async function handleTyping(e: any) {
        const { currentTarget } = e;
        console.log(currentTarget.value);
        setMessage(currentTarget.value);

        // onChange={e => setMessage(e.currentTarget.value)}
    }
    return (
        <>
            <form id="chat" onSubmit={handleSubmit}>
                <main className="messages">
                    {displayMessages.map(display => (
                        <div className="message" key={display.id}>
                            <strong>{display.name}</strong>: {display.message}
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
