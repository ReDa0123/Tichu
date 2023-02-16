import { useMemo } from "react";
import Card from "../Card";
import "../Modal.scss";

const SendCardsModal = ({
  selectedCards,
  setSelectedCards,
  waitingForOthersToSend,
  onSend,
}) => {
  const blankCards = useMemo(() => {
    const cards = [];
    for (let i = 0; i < 3 - selectedCards.length; i++) {
      cards.push(<Card blank key={i} />);
    }
    return cards;
  }, [selectedCards]);

  return (
    <div className="Modal">
      <h2 className="Modal-header">
        {waitingForOthersToSend
          ? "Waiting for others to send cards..."
          : "Send cards to other players"}
      </h2>
      <div className="Modal-cards">
        {selectedCards.map((card) => (
          <Card
            key={`${card.color}${card.number}${card.name}`}
            {...card}
            onClick={() =>
              setSelectedCards((selectedCards) => [
                ...selectedCards.filter((c) => c !== card),
              ])
            }
            disabled={waitingForOthersToSend}
          />
        ))}
        {blankCards}
      </div>
      {!waitingForOthersToSend && <button onClick={onSend}>Send Cards</button>}
    </div>
  );
};

export default SendCardsModal;
