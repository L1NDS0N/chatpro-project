import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import home from '../../assets/home-ilustracao.png';
import logo from '../../assets/logo.svg';
import { useUser } from '../../contexts/SocketContext';
import ws from '../../modules/SocketConnection.module';
import './styles.css';

const Home: React.FC = () => {
    const history = useHistory();
    const [user, setUser] = useState('');
    const { saveUser } = useUser();

    async function handleSignin(event: FormEvent) {
        event.preventDefault();
        const socket: SocketIOClient.Socket = ws;
        socket.emit('registrationEvent', user);
        socket.on('registrationEvent', (savedUser: any) => {
            const sUser = JSON.parse(savedUser);
            saveUser({
                id: sUser.id,
                name: sUser.name,
                socketId: sUser.socket_id,
                createdAt: sUser.created_at,
            });
        });
        history.push('/chat');
    }

    return (
        <>
            <header>
                <img src={logo} alt="logo" />
            </header>
            <div className="container">
                <section>
                    <div className="home-txt">
                        <h1>
                            <b>
                                Converse com outras pessoas nessa amostra de
                                chat
                            </b>
                        </h1>
                        <br />
                        <form onSubmit={handleSignin}>
                            <label htmlFor="entrar">
                                Insira seu nome
                                <input
                                    onChange={e =>
                                        setUser(e.target.value as any)
                                    }
                                    type="text"
                                    id="entrar"
                                />
                            </label>
                            <button type="submit">Entrar</button>
                        </form>
                    </div>
                    <div className="home-img">
                        <img src={home} alt="home" />
                    </div>
                </section>
            </div>
        </>
    );
};
export default Home;
