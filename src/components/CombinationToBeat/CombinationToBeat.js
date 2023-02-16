import Card from "../Card";
import "./CombinationToBeat.scss";
import { isNotEmpty } from "ramda-extension";

const CombinationToBeat = ({ combination: { playedBy, cards, type } }) => {
  return isNotEmpty(cards) ? (
    <div className="CombinationToBeat">
      <div className="CombinationToBeat-header">
        <h2>Combination to beat</h2>
        <p>Played by {playedBy}</p>
      </div>
      <div className="CombinationToBeat-cards">
        {cards.map((card) => (
          <Card
            key={`${card.color}${card.number}${card.name}`}
            {...card}
            onClick={() => {}}
          />
        ))}
      </div>
      <div className="CombinationToBeat-type">
        <h3>{type}</h3>
      </div>
    </div>
  ) : null;
};

export default CombinationToBeat;
