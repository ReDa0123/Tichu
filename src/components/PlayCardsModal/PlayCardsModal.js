import "../Modal.scss";
import Card from "../Card";
import { useState } from "react";
import { isFirstPlayOfTheTurn } from "../../redux/selectors";
import { useSelector } from "react-redux";
import { isNotEmpty } from "ramda-extension";

const PlayCardsModal = ({
  selectedCards,
  setSelectedCards,
  onPlay,
  onPass,
  valueModalOpen,
}) => {
  const [hidden, setHidden] = useState(false);
  const firstPlayOfTheTurn = useSelector(isFirstPlayOfTheTurn);
  return (
    <>
      {!hidden && (
        <div className="Modal">
          <div className="Modal-header">
            <h2>Select Cards To Play</h2>
            <button className="Modal-xBtn" onClick={() => setHidden(true)}>
              -
            </button>
          </div>
          <div className="Modal-cards">
            {selectedCards.map((card) => (
              <Card
                key={`${card.color}${card.number}${card.name}`}
                {...card}
                onClick={() => {
                  if (valueModalOpen) return;
                  setSelectedCards((selectedCards) => [
                    ...selectedCards.filter((c) => c !== card),
                  ]);
                }}
              />
            ))}
          </div>
          <div className="Modal-footer">
            {!firstPlayOfTheTurn && <button onClick={onPass}>Pass</button>}
            {isNotEmpty(selectedCards) && (
              <button onClick={() => setSelectedCards([])}>Unselect all</button>
            )}
            <button onClick={onPlay}>Play Cards</button>
          </div>
        </div>
      )}
      {hidden && (
        <button className="Modal-hideBtn" onClick={() => setHidden(false)}>
          Show
        </button>
      )}
    </>
  );
};

export default PlayCardsModal;
