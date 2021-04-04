import React, {
    createContext,
    useState,
    useEffect,
    useCallback,
    useContext,
    ReactNode,
} from 'react';

interface User {
    id?: string;
    name?: string;
    socketId?: string;
    createdAt?: string;
}

interface UserContextData {
    saveUser(user: User): void;
    newUser: User;
}

// interface SocketProviderProps {
//     children: ReactNode;
// }

export const SocketContext = createContext<UserContextData>(
    {} as UserContextData,
);

// eslint-disable-next-line react/prop-types
export const SocketProvider: React.FC = ({ children }) => {
    const [newUser, setNewUser] = useState<User>({});

    useEffect(() => {
        Notification.requestPermission();
    }, []);

    const saveUser = useCallback(({ id, name, socketId, createdAt }: User) => {
        const user = {
            id,
            name,
            socketId,
            createdAt,
        };
        setNewUser(user);
        console.log(user);
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
