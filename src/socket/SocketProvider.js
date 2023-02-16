import { createContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_SERVER_URL } from "./constants";
import { useDispatch } from "react-redux";
import { setInitialized, setSocketId } from "../redux/actions";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL);
    socket.on("connect", () => {
      setSocket(socket);
      dispatch(setInitialized(true));
      dispatch(setSocketId(socket.id));
    });

    return () => socket.disconnect();
  }, [dispatch]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
