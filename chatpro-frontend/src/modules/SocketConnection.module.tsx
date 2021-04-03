import io from 'socket.io-client';

const ws = io.connect('http://localhost:3333');

export default ws;
