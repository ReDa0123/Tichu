import { keyMirror } from "ramda-extension";

export const GAME_STATE_REDUCER_NAME = "gameState";
export const SOCKET_REDUCER_NAME = "socket";
export const MESSAGES_REDUCER_NAME = "messages";

export const messagesActionNames = keyMirror({
  ADD_MESSAGE: null,
  DELETE_MESSAGE: null,
});

export const gameStateActionTypes = keyMirror({
  SET_GAME_STATE: null,
});

export const socketActionTypes = keyMirror({
  SET_PLAYERS: null,
  INITIALIZE: null,
  SET_SOCKET_ID: null,
});
