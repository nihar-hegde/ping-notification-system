import { io } from "socket.io-client";

const SOCKET_URL = "https://ping-notification-system.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});
