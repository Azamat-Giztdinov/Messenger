import {io} from "socket.io-client"
// import { config } from "dotenv";
// config()

const socket = new io(
    // process.env.REACT_APP_SERVER_URL, 
    "http://localhost:5000",
    {
    autoConnect: false,
    withCredentials: true
});

export default socket;