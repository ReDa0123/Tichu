import { getOtherIds } from "../../redux/selectors";
import { useSelector } from "react-redux";
import useSocket from "../../socket/useSocket";
import { remove } from "ramda";

const DIRECTIONS = ["Left", "Right"];

const SendDeckModal = () => {
  const othersIds = useSelector(getOtherIds);
  const socket = useSocket();
  return (
    <div className="Modal">
      <h2>Send Deck To?</h2>
      <div className="Modal-options">
        {remove(1, 1, othersIds).map((id, index) => (
          <button key={id} onClick={() => socket.emit("sendDeck", id)}>
            {DIRECTIONS[index]}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SendDeckModal;
