/* eslint-disable no-param-reassign */
import React, { FormEvent, useEffect, useRef, useState } from 'react';
import Gravatar from 'react-gravatar';
import { Fade } from 'react-awesome-reveal';
import { useSocket } from '../../contexts/SocketContext';
import ws from '../../modules/SocketConnection.module';
import './styles.css';
import loadingImg from '../../assets/loading.svg';

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
    const [loading, setLoading] = useState(true);

    const mainMessagesRef = useRef<HTMLDivElement>(null);

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

    // Inicializador de mensagens do Chat
    useEffect(() => {
        if (displayMessages.length <= 0) {
            socket.emit('sendMePreviousMessages', newUser);
            socket.on('previousMessages', (response: any) => {
                // eslint-disable-next-line no-plusplus
                for (let index = 0; index <= response.length; index++) {
                    if (response.length === index) {
                        setLoading(false);
                    }
                    try {
                        const parsedDate = String(
                            new Date(response[index].created_at),
                        );
                        setDisplayMessages(oldMessages => [
                            ...oldMessages,
                            {
                                id: response[index].id,
                                name: response[index].user_id,
                                message: response[index].message,
                                createdAt: parsedDate,
                            },
                        ]);
                    } catch (err) {
                        console.warn(err);
                    }
                }
                mainMessagesRef.current?.scrollIntoView({
                    behavior: 'smooth',
                });
            });
        }
    }, [displayMessages]);

    socket.on('receivedMessage', (response: any) => {
        const parsedDate = String(new Date(response.created_at));
        setDisplayMessages([
            ...displayMessages,
            {
                id: response.id,
                name: response.user_id,
                message: response.message,
                createdAt: parsedDate,
            },
        ]);
    });

    return (
        <>
            <form id="chat" onSubmit={handleSubmit}>
                <main className="messages">
                    {loading ? (
                        <img
                            className="spinnerLoading"
                            src={loadingImg}
                            alt="carregando..."
                        />
                    ) : (
                        displayMessages.map(display => (
                            <Fade cascade direction="top-left" triggerOnce>
                                <div
                                    title={
                                        display.name
                                            ? `usuário: ${display.name}`
                                            : `você enviou em ${String(
                                                  new Date(Date.now()),
                                              )}`
                                    }
                                    className={
                                        display.name === newUser.id ||
                                        newUser.name
                                            ? 'myMessage'
                                            : 'message'
                                    }
                                    key={display.id}
                                >
                                    <Gravatar
                                        email={String(display.userId)}
                                        className="Gravatar"
                                    />
                                    <strong>
                                        {display.name ? display.name : ''}:
                                    </strong>
                                    {display.message}
                                    <pre>
                                        {display.createdAt
                                            ? String(display.createdAt)
                                            : ''}
                                    </pre>
                                </div>
                            </Fade>
                        ))
                    )}
                    <div ref={mainMessagesRef} />
                </main>
                <input
                    id="inputMessages"
                    className="inputMessages"
                    type="text"
                    value={message}
                    onChange={handleTyping}
                    placeholder="Insira sua mensagem"
                    required
                />
                <button className="buttonMessages" type="submit">
                    Enviar
                </button>
            </form>
        </>
    );
};
export default Chat;
