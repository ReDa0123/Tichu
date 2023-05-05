import { useDispatch, useSelector } from "react-redux";
import {
  getNumberOfCardsInAllOtherHands,
  getGamePart,
  getSortedCardsInHand,
  isUserOnPlay,
  getCurrentCombination,
  getSendDeck,
  getFirstEightCardsInHand,
  getUsernames,
} from "../../redux/selectors";
import Card from "../Card";
import { includes, propEq } from "ramda";
import { useCallback, useEffect, useState } from "react";
import "./GameContainer.scss";
import SendCardsModal from "../SendCardsModal";
import {
  COMBINATIONS,
  GAME_PARTS,
  SPECIAL_CARDS,
} from "../../gameLogic/constants";
import useSocket from "../../socket/useSocket";
import { addMessage } from "../../redux/actions";
import PlayCardsModal from "../PlayCardsModal";
import { resolveSpecialCardSelect } from "../../gameLogic/actions";
import {
  getCombinationType,
  isValidCombination,
} from "../../gameLogic/combinationResolver";
import { isCardInArray } from "../../utils/cards";
import SendDeckModal from "../SendDeckModal";
import InfoBoard from "../InfoBoard";
import CombinationToBeat from "../CombinationToBeat";
import ValueModal from "../ValueModal";
import { isNilOrEmpty } from "ramda-extension";
import TichuModal from "../TichuModal";
import TurnEndModal from "../TurnEndModal";

const GameContainer = () => {
  const socket = useSocket();
  const dispatch = useDispatch();
  const [selectedCards, setSelectedCards] = useState([]);
  const [waitingForOthers, setWaitingForOthers] = useState(false);
  const [valueModalOpen, setValueModalOpen] = useState(false);
  const gamePart = useSelector(getGamePart);
  const cardsInHand = useSelector(getSortedCardsInHand);
  const firstEighthCardsInHand = useSelector(getFirstEightCardsInHand);
  const cardInOtherPlayersHands = useSelector(getNumberOfCardsInAllOtherHands);
  const isOnPlay = useSelector(isUserOnPlay);
  const currentRoundCombination = useSelector(getCurrentCombination);
  const shouldSendDeck = useSelector(getSendDeck);
  const usernames = useSelector(getUsernames);

  const selectCard = useCallback(
    (card) => {
      if (
        includes(card, selectedCards) ||
        isCardInArray(card.name, selectedCards)
      ) {
        if (card.name === SPECIAL_CARDS.PHOENIX) {
          setSelectedCards((selectedCards) =>
            selectedCards.filter((c) => c.name !== SPECIAL_CARDS.PHOENIX)
          );
        }
        return setSelectedCards((selectedCards) => [
          ...selectedCards.filter((c) => c !== card),
        ]);
      }
      if (gamePart === GAME_PARTS.SEND_CARDS && selectedCards.length >= 3)
        return;
      if (valueModalOpen) return;
      if (gamePart === GAME_PARTS.PLAY_CARDS) {
        if (card.special) {
          return dispatch(
            resolveSpecialCardSelect(
              card,
              selectedCards,
              setSelectedCards,
              socket,
              setValueModalOpen
            )
          );
        }
        if (isCardInArray(SPECIAL_CARDS.DRAGON, selectedCards)) {
          return dispatch(
            addMessage("You can only play the dragon as a single card.")
          );
        }
        if (
          isCardInArray(SPECIAL_CARDS.PHOENIX, selectedCards) &&
          selectedCards.length === 1 &&
          (currentRoundCombination.type === COMBINATIONS.SINGLE ||
            isNilOrEmpty(currentRoundCombination.type))
        ) {
          return dispatch(
            addMessage(
              "Remove the phoenix card if you want to play a longer combination."
            )
          );
        }
      }
      setSelectedCards((selectedCards) => [...selectedCards, card]);
    },
    [
      gamePart,
      selectedCards,
      dispatch,
      socket,
      valueModalOpen,
      currentRoundCombination,
    ]
  );

  const onSendCards = useCallback(() => {
    if (selectedCards.length === 3) {
      setWaitingForOthers(true);
      socket.emit("sendCards", selectedCards);
    } else {
      dispatch(addMessage("You must select 3 cards to send."));
    }
  }, [dispatch, selectedCards, socket]);

  const onPlayCards = useCallback(() => {
    if (valueModalOpen) return;
    const combinationType = getCombinationType(selectedCards);
    if (combinationType === null) {
      return dispatch(addMessage("Select a valid combination."));
    }
    const validCombination = isValidCombination(
      selectedCards,
      combinationType,
      currentRoundCombination
    );
    if (!validCombination) {
      return dispatch(
        addMessage(
          "Select a bigger combination of the same type than the current one (or play a bomb)."
        )
      );
    }
    socket.emit("playCards", { cards: selectedCards, combinationType });
  }, [
    dispatch,
    selectedCards,
    currentRoundCombination,
    socket,
    valueModalOpen,
  ]);

  useEffect(() => {
    const waiting = gamePart === GAME_PARTS.PLAY_CARDS && !isOnPlay;
    setWaitingForOthers(waiting);
    setSelectedCards([]);
  }, [gamePart, isOnPlay]);

  return (
    <div className="GameContainer">
      <div className="CardsInHand-others">
        {cardInOtherPlayersHands.map(({ numberOfCards, id }) => (
          <div key={id}>
            <Card hidden value={numberOfCards} />
            {usernames[id]}
          </div>
        ))}
      </div>
      <InfoBoard />
      {valueModalOpen && (
        <ValueModal
          setValueModalOpen={setValueModalOpen}
          specialCard={cardsInHand.find(propEq("name", SPECIAL_CARDS.PHOENIX))}
          setSelectedCards={setSelectedCards}
        />
      )}
      {(gamePart === GAME_PARTS.BIG_TICHU ||
        gamePart === GAME_PARTS.SMALL_TICHU) && (
        <TichuModal
          gamePart={gamePart}
          waitingForOthers={waitingForOthers}
          setWaitingForOthers={setWaitingForOthers}
        />
      )}
      {gamePart === GAME_PARTS.SEND_CARDS && (
        <SendCardsModal
          selectedCards={selectedCards}
          setSelectedCards={setSelectedCards}
          waitingForOthersToSend={waitingForOthers}
          setWaitingForOthersToSend={setWaitingForOthers}
          onSend={onSendCards}
        />
      )}
      {gamePart === GAME_PARTS.PLAY_CARDS && (
        <CombinationToBeat combination={currentRoundCombination} />
      )}
      {gamePart === GAME_PARTS.PLAY_CARDS &&
        isOnPlay &&
        (shouldSendDeck ? (
          <SendDeckModal />
        ) : (
          <PlayCardsModal
            valueModalOpen={valueModalOpen}
            selectedCards={selectedCards}
            setSelectedCards={setSelectedCards}
            onPlay={onPlayCards}
            onPass={() => {
              if (valueModalOpen) return;
              socket.emit("pass");
            }}
          />
        ))}
      {gamePart === GAME_PARTS.TURN_END && (
        <TurnEndModal
          waitingForOthers={waitingForOthers}
          setWaitingForOthers={setWaitingForOthers}
        />
      )}
      <div className={"CardsInHand"}>
        {gamePart !== GAME_PARTS.BIG_TICHU
          ? cardsInHand.map((card, index) => (
              <Card
                key={index}
                {...card}
                selected={
                  includes(card, selectedCards) ||
                  isCardInArray(card.name, selectedCards)
                }
                onClick={() => selectCard(card)}
                disabled={
                  waitingForOthers ||
                  shouldSendDeck ||
                  gamePart === GAME_PARTS.SMALL_TICHU
                }
              />
            ))
          : firstEighthCardsInHand.map((card) => (
              <Card
                key={`${card?.color}${card?.number}${card?.name}`}
                {...card}
                disabled
              />
            ))}
      </div>
    </div>
  );
};

export default GameContainer;
