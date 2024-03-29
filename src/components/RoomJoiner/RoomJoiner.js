import { roomStatuses } from "./constants";
import { useCallback, useEffect, useState } from "react";
import useSocket from "../../socket/useSocket";
import { isNilOrEmpty } from "ramda-extension";
import { addMessage, setPlayers } from "../../redux/actions";
import { useDispatch, useSelector } from "react-redux";
import { getPlayers } from "../../redux/selectors";
import "./RoomJoiner.scss";

const RoomSelect = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const [roomId, setRoomId] = useState("");
  const [name, setName] = useState();

  const joinRoom = useCallback(() => {
    if (isNilOrEmpty(roomId) || isNilOrEmpty(name)) {
      dispatch(addMessage("Fill in name and Room ID"));
      return;
    }
    socket.emit("joinRoom", { roomId, name });
  }, [socket, dispatch, name, roomId]);

  useEffect(() => {
    socket.on("roomFull", () => dispatch(addMessage("room full")));
    socket.on("sameName", () =>
      dispatch(addMessage("A player in this room has the same name"))
    );

    return () => {
      socket.off("roomFull");
      socket.off("sameName");
    };
  }, [dispatch, socket]);

  return (
    <div className="RoomSelect">
      <h1>Room Select</h1>
      <input
        type="text"
        placeholder="Room ID"
        onChange={(e) => setRoomId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={joinRoom}>Join</button>
    </div>
  );
};

const RoomWaiter = ({ setStatus }) => {
  const numPlayers = useSelector(getPlayers);
  const socket = useSocket();

  return (
    <div className="RoomSelect">
      <div>Waiting for players...</div>
      <div>Currently players in room: {numPlayers} / 4</div>
      <button
        onClick={() => {
          socket.emit("leaveRoom");
          setStatus(roomStatuses.ROOM_SELECT);
        }}
      >
        Leave Room
      </button>
    </div>
  );
};

const RoomJoiner = () => {
  const [status, setStatus] = useState(roomStatuses.ROOM_SELECT);
  const socket = useSocket();
  const dispatch = useDispatch();

  useEffect(() => {
    socket.on("newConnection", (numPlayers) => {
      if (status === roomStatuses.WAITING_FOR_PLAYERS) {
        dispatch(addMessage("A player connected!", "green"));
      }
      setStatus(roomStatuses.WAITING_FOR_PLAYERS);
      dispatch(setPlayers(numPlayers));
    });

    socket.on("otherDisconnected", (numPlayers) => {
      dispatch(setPlayers(numPlayers));
      dispatch(addMessage("A player disconnected."));
    });

    return () => {
      socket.off("newConnection");
      socket.off("otherDisconnected");
    };
  }, [dispatch, socket, status]);

  return status === roomStatuses.ROOM_SELECT ? (
    <RoomSelect />
  ) : (
    <RoomWaiter setStatus={setStatus} />
  );
};

export default RoomJoiner;
