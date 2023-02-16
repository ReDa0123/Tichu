import useSocket from "../../socket/useSocket";
import { useCallback } from "react";

const TurnEndModal = ({ waitingForOthers, setWaitingForOthers }) => {
  const socket = useSocket();

  const onContinue = useCallback(() => {
    socket.emit("continue");
    setWaitingForOthers(true);
  }, [socket, setWaitingForOthers]);

  return (
    <div className="Modal">
      <h2>Turn ended</h2>
      {waitingForOthers ? (
        <div>Waiting for others to continue</div>
      ) : (
        <div className="Modal-options">
          <button onClick={() => window.location.reload()}>Disconnect</button>
          <button onClick={onContinue}>Continue</button>
        </div>
      )}
    </div>
  );
};

export default TurnEndModal;
