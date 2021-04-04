import React from 'react';

import './App.css';
import Routes from './routes';
import { SocketProvider } from './contexts/SocketContext';

const App: React.FC = () => {
    return (
        <>
            <SocketProvider>
                <Routes />
            </SocketProvider>
        </>
    );
};

export default App;
