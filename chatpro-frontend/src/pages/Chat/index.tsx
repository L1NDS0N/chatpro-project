import React, { FormEvent, useEffect, useState } from 'react';
import SocketIoClient from 'socket.io-client';
import './styles.css';
import ws from '../../modules/SocketConnection.module';

interface User {
    readonly id?: string;
    name?: string;
    message?: string;
}

const Chat: React.FC = () => {
    const [messageBody, setMessageBody] = useState<User>();
    const [message, setMessage] = useState('');
    const [displayMessages, setDisplayMessages] = useState([
        { name: 'Lindson', message: 'olá!' },
    ]);
    const socket: SocketIOClient.Socket = ws;

    async function handleSubmit(event: FormEvent) {
        event.preventDefault();
        const element = document.getElementById('inputMessages');
        element?.focus();
        if (message !== '' && message !== null) {
            setDisplayMessages([
                ...displayMessages,
                { name: 'Lindson', message },
            ]);
            setMessageBody({ name: 'Lindson', message });
            socket.emit('sendMessage', messageBody);
        }
        setMessage('');
    }

    socket.on('receivedMessage', (response: any) => {
        setDisplayMessages([...displayMessages, response]);
        console.log(response);
    });

    return (
        <>
            <form id="chat" onSubmit={handleSubmit}>
                <main className="messages">
                    {displayMessages.map(display => (
                        <div className="message">
                            <strong>{display.name}</strong>: {display.message}
                        </div>
                    ))}
                </main>
                <input
                    id="inputMessages"
                    type="text"
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Insira sua mensagem"
                />
                <button type="submit">Enviar</button>
            </form>
        </>
    );
};
export default Chat;
