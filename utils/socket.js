// import { io } from "socket.io-client";
// export const socket = io("http://192.168.133.136:3000");


import { io } from "socket.io-client";

const socket = io("http://192.168.133.136:3000", {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
  transports: ["websocket"],
  auth: {
    token: "USER_AUTH_TOKEN" // JWT या session token
  }
});

export default socket;