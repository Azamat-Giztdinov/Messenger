import {io} from "socket.io-client"

const socket = user => 
    new io(
        // process.env.REACT_APP_SERVER_URL, 
        "http://localhost:5000",
        {
        autoConnect: false,
        withCredentials: true,
        auth: {
            token: user.tpken
        },
    });

export default socket;