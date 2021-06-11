import io from 'socket.io-client';

const socket = io(process.env.NODE_ENV !== 'production' ? 'http://localhost:3001' : 'https://just-chatting.herokuapp.com');

export default socket;
