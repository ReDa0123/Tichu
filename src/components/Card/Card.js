import { cx } from "ramda-extension";
import "./Card.scss";

const Card = ({
  color,
  number,
  special,
  name,
  disabled,
  onClick,
  selected,
  hidden,
  value,
  blank,
}) => {
  return hidden ? (
    <div className="Card Card--hidden">
      <div>{value}</div>
    </div>
  ) : blank ? (
    <div className="Card" style={{ backgroundColor: "white" }} />
  ) : (
    <div
      className={cx("Card", {
        "Card--disabled": disabled,
        "Card--selected": selected,
      })}
      onClick={disabled || hidden ? null : onClick}
    >
      {special ? (
        <div className={`Card-${name} Card-special`}>
          <div>{name}</div>
          {number ? <div>{`(As: ${number})`}</div> : ""}
        </div>
      ) : (
        <div className={`Card-${color}`}>{number}</div>
      )}
    </div>
  );
};

export default Card;
