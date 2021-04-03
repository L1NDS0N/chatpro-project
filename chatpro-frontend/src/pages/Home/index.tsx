import React, { FormEvent, useState } from 'react';
import { useHistory } from 'react-router-dom';
import home from '../../assets/home-ilustracao.png';
import logo from '../../assets/logo.svg';
import ws from '../../modules/SocketConnection.module';
import './styles.css';

type UserData = {
    id?: string;
    username?: string;
    socketId?: string;
    createdAt?: string;
};

const Home: React.FC = () => {
    const [user, setUser] = useState({} as UserData);
    const history = useHistory();
    async function handleSignin(event: FormEvent) {
        event.preventDefault();

        const socket: SocketIOClient.Socket = ws;
        socket.emit('registrationEvent', user);
        socket.on('registrationEvent', (savedUser: any) => {
            setUser({
                id: savedUser.id,
                username: savedUser.name,
                socketId: savedUser.socket_id,
                createdAt: savedUser.created_at,
            });
            console.log(user.id);
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
