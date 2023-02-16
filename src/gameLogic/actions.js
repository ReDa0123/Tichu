import { COMBINATIONS, SPECIAL_CARDS } from "./constants";
import {
  getCurrentCombinationType,
  getValueOfLastPlayedCard,
  isFirstPlayOfTheTurn,
} from "../redux/selectors";
import { addMessage } from "../redux/actions";
import { isNilOrEmpty } from "ramda-extension";
import { isCardInArray } from "../utils/cards";

export const resolveSpecialCardSelect =
  (card, selectedCards, setSelectedCards, socket, setValueModalOpen) =>
  (dispatch, getState) => {
    const { name } = card;
    switch (name) {
      case SPECIAL_CARDS.DOG: {
        const isFirstPlayOfTurn = isFirstPlayOfTheTurn(getState());
        if (isFirstPlayOfTurn) {
          return socket.emit("dog");
        }
        return dispatch(
          addMessage("You can only play the dog as a first play of the turn.")
        );
      }
      case SPECIAL_CARDS.DRAGON: {
        const isFirstSelectedCard = selectedCards.length === 0;
        if (isFirstSelectedCard) {
          return setSelectedCards((selectedCards) => [...selectedCards, card]);
        }
        return dispatch(
          addMessage("You can only play the dragon as a single card.")
        );
      }
      case SPECIAL_CARDS.PHOENIX: {
        const currentCombination = getCurrentCombinationType(getState());
        const isFirstSelectedCard = selectedCards.length === 0;
        if (
          isCardInArray(SPECIAL_CARDS.PHOENIX, selectedCards) &&
          card.name === SPECIAL_CARDS.PHOENIX
        )
          return;
        if (
          isFirstSelectedCard &&
          (currentCombination === COMBINATIONS.SINGLE ||
            isNilOrEmpty(currentCombination))
        ) {
          const valueOfLastPlayedCard = getValueOfLastPlayedCard(getState());
          return setSelectedCards((selectedCards) => [
            ...selectedCards,
            { ...card, number: valueOfLastPlayedCard + 0.5 },
          ]);
        }
        return setValueModalOpen(true);
      }
      default: {
        setSelectedCards((selectedCards) => [...selectedCards, card]);
      }
    }
  };
