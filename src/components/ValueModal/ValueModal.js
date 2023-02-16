import { useCallback, useState } from "react";
import { NUMBERS } from "../../gameLogic/constants";
import { map, o, values } from "ramda";

const ValueModal = ({ setValueModalOpen, specialCard, setSelectedCards }) => {
  const [value, setValue] = useState("1");
  const onSubmit = useCallback(() => {
    setValueModalOpen(false);
    setSelectedCards((selectedCards) => [
      ...selectedCards,
      { ...specialCard, number: value },
    ]);
  }, [setValueModalOpen, setSelectedCards, value, specialCard]);

  return (
    <div className="Modal" style={{ zIndex: 10000 }}>
      <h2>Enter Value</h2>
      <select value={value} onChange={(e) => setValue(e.target.value)}>
        {o(
          map((number) => (
            <option key={number} value={number}>
              {number}
            </option>
          )),
          values
        )(NUMBERS)}
      </select>
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
};

export default ValueModal;
