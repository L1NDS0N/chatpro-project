import React, { FormEvent, useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import home from '../../assets/home-ilustracao.png';
import logo from '../../assets/logo.svg';
import { SocketContext, useUser } from '../../contexts/SocketContext';
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
            saveUser({
                id: savedUser.id,
                name: savedUser.name,
                socketId: savedUser.socket_id,
                createdAt: savedUser.createad_at,
            });
            console.log(user);
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
