import { useEffect, useState } from "react";
import useSocket from "./socket/useSocket";
import RoomJoiner from "./components/RoomJoiner";
import { useDispatch, useSelector } from "react-redux";
import { isSocketInitialized } from "./redux/selectors";
import MessagesWrapper from "./components/MessagesWrapper";
import { addMessage, setGameState } from "./redux/actions";
import GameContainer from "./components/GameContainer";
import "./App.scss";

function App() {
  const socket = useSocket();
  const dispatch = useDispatch();
  const [inGame, setInGame] = useState(false);
  const initialized = useSelector(isSocketInitialized);

  useEffect(() => {
    if (!socket) return;
    socket.on("gameReady", (gameState) => {
      setInGame(true);
      dispatch(setGameState(gameState));
    });

    socket.on("stateChanged", (gameState) => dispatch(setGameState(gameState)));

    socket.on("gameRip", () => {
      if (inGame) {
        setInGame(false);
        dispatch(addMessage("A player disconnected. The game ended."));
        socket.emit("leaveRoom");
        dispatch(setGameState({}));
      }
    });

    socket.on("message", (message) =>
      dispatch(addMessage(message, "blue", 7500))
    );

    socket.on("log", console.log);

    return () => {
      socket.off("gameReady");
      socket.off("gameRip");
      socket.off("stateChanged");
      socket.off("message");
      socket.off("log");
    };
  }, [dispatch, socket, inGame]);

  return !initialized || !socket ? (
    "Loading..."
  ) : (
    <MessagesWrapper>
      {inGame ? <GameContainer /> : <RoomJoiner />}
    </MessagesWrapper>
  );
}

export default App;
