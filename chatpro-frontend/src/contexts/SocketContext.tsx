import React, {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

interface User {
    id: string;
    name: string;
    socketId: string;
    createdAt: string;
}

interface UserContextData {
    saveUser(user: User): void;
    newUser: User;
}

export const SocketContext = createContext<UserContextData>(
    {} as UserContextData,
);

export const SocketProvider: React.FC = ({ children }) => {
    const [newUser, setNewUser] = useState({} as User);

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    function logUser(user: User) {
        console.log(`This is loguser: `, user);
    }

    const saveUser = useCallback(({ id, name, socketId, createdAt }: User) => {
        const user = {
            id,
            name,
            socketId,
            createdAt,
        };
        setNewUser(user);
        logUser(user);
    }, []);

    return (
        <SocketContext.Provider value={{ saveUser, newUser }}>
            {children}
        </SocketContext.Provider>
    );
};

export function useUser(): UserContextData {
    const context = useContext(SocketContext);

    if (!context)
        throw new Error('useUser must be used within an SocketProvider');

    return context;
}
