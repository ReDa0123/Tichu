import {
  ascend,
  compose,
  head,
  includes,
  length,
  map,
  mapObjIndexed,
  o,
  pluck,
  prop,
  propOr,
  slice,
  sort,
} from "ramda";
import {
  GAME_STATE_REDUCER_NAME,
  MESSAGES_REDUCER_NAME,
  SOCKET_REDUCER_NAME,
} from "./constants";
import { createSelector } from "reselect";
import { GAME_PARTS, VALUES } from "../gameLogic/constants";
import { isNilOrEmpty } from "ramda-extension";

export const getSocket = propOr({}, [SOCKET_REDUCER_NAME]);
export const isSocketInitialized = o(propOr(false, "initialized"), getSocket);
export const getPlayers = o(prop("players"), getSocket);
export const getSocketId = o(prop("socketId"), getSocket);

export const getMessages = propOr({}, [MESSAGES_REDUCER_NAME]);
export const getDisplayed = o(propOr([], "displayed"), getMessages);

export const getGameState = propOr({}, [GAME_STATE_REDUCER_NAME]);
export const getGamePart = o(prop("gamePart"), getGameState);
export const getCards = o(prop("cards"), getGameState);
export const getTeams = o(prop("teams"), getGameState);
export const getTurnOrder = o(prop("turnOrder"), getGameState);
export const getOnPlay = o(prop("onPlay"), getGameState);
export const getCardsPlayedThisTurn = o(
  prop("cardsPlayedThisTurn"),
  getGameState
);
export const getCurrentCombination = o(
  prop("currentCombination"),
  getGameState
);

export const getSendDeck = o(prop("sendDeck"), getGameState);

export const getCardsInHand = createSelector(
  [getSocketId, getCards],
  (socketId, cards) => cards[socketId]
);
export const getSortedCardsInHand = createSelector(
  [getCardsInHand],
  sort(ascend((card) => VALUES[prop("number", card)] ?? 20))
);
export const getFirstEightCardsInHand = createSelector(
  [getCardsInHand],
  o(sort(ascend((card) => VALUES[prop("number", card)] ?? 20)), slice(0, 8))
);

export const getOtherIds = createSelector(
  [getSocketId, getTurnOrder],
  (socketId, turnOrder) => {
    const index = turnOrder.indexOf(socketId);
    return [
      turnOrder[(index + 1) % length(turnOrder)],
      turnOrder[(index + 2) % length(turnOrder)],
      turnOrder[(index + 3) % length(turnOrder)],
    ];
  }
);

export const getNumberOfCardsInAllOtherHands = createSelector(
  [getOtherIds, getCards],
  (ids, cards) =>
    map(
      (id) => ({
        numberOfCards: length(cards[id]),
        id,
      }),
      ids
    )
);

export const isUserOnPlay = createSelector(
  [getSocketId, getOnPlay],
  (id, onPlay) => onPlay === id
);

export const isFirstPlayOfTheTurn = createSelector(
  getCardsPlayedThisTurn,
  isNilOrEmpty
);

export const getTeamsScore = createSelector(getTeams, pluck("score"));

export const getNameOfYourTeam = createSelector(
  [getSocketId, getTeams],
  (socketId, teams) => {
    const playersInTeams = pluck("players", teams);
    return includes(socketId, playersInTeams[0]) ? 1 : 2;
  }
);

export const getActiveTichus = compose(
  mapObjIndexed((tichu, id) => {
    if (tichu) {
      return `${id}: ${
        tichu === GAME_PARTS.BIG_TICHU ? "Grand Tichu" : "Tichu"
      }`;
    }
    return null;
  }),
  propOr({}, "tichu"),
  getGameState
);

export const isBigTichuActive = createSelector(
  [getGameState, getSocketId],
  ({ tichu }, socketId) => tichu[socketId] === GAME_PARTS.BIG_TICHU
);

export const getValueOfLastPlayedCard = createSelector(
  getCurrentCombination,
  ({ cards }) => {
    const card = head(cards);
    return card ? VALUES[prop("number", card)] : 0;
  }
);

export const getCurrentCombinationType = createSelector(
  getCurrentCombination,
  propOr("", "type")
);
