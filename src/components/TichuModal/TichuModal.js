import useSocket from "../../socket/useSocket";
import { GAME_PARTS } from "../../gameLogic/constants";
import { isBigTichuActive } from "../../redux/selectors";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { addMessage } from "../../redux/actions";

const TichuModal = ({ gamePart, waitingForOthers, setWaitingForOthers }) => {
  const dispatch = useDispatch();
  const socket = useSocket();
  const bigTichuActive = useSelector(isBigTichuActive);

  useEffect(() => {
    if (bigTichuActive && gamePart === GAME_PARTS.SMALL_TICHU) {
      dispatch(
        addMessage(
          "You have already called Grand tichu. You can't call small tichu.",
          "blue",
          7500
        )
      );
      socket.emit("callTichu", true);
      setTimeout(() => setWaitingForOthers(true), 0);
    }
  }, [bigTichuActive, socket, setWaitingForOthers, gamePart, dispatch]);

  return (
    <div className="Modal">
      <h2>{`Do you want to call a ${
        gamePart === GAME_PARTS.BIG_TICHU ? "Grand Tichu" : "Tichu"
      }?`}</h2>
      {waitingForOthers ? (
        <div>Waiting for other players...</div>
      ) : (
        <div className="Modal-options">
          <button
            onClick={() => {
              socket.emit("tichuPass");
              setWaitingForOthers(true);
            }}
          >
            No
          </button>
          <button
            onClick={() => {
              socket.emit("callTichu");
              setWaitingForOthers(true);
            }}
          >
            Yes
          </button>
        </div>
      )}
    </div>
  );
};

export default TichuModal;
