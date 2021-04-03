import React, { createContext, useState, ReactNode, useEffect } from 'react';

interface UserContextData {
    id?: string;
    name?: string;
    message?: string;
    socketObject?: SocketIOClientStatic;
}

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketContext = createContext({} as UserContextData);

export function SocketPrivder({ children }: SocketProviderProps) {
    const [id, setId] = useState('');
    const [socketId, setSockedId] = useState('');
    const [name, setName] = useState('');

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    return (
        <SocketContext.Provider
            value={{
                id,
                name,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
}
