import {
  gameStateActionTypes,
  messagesActionNames,
  socketActionTypes,
} from "./constants";

export const setInitialized = (initialized) => ({
  type: socketActionTypes.INITIALIZE,
  payload: initialized,
});

export const setPlayers = (players) => ({
  type: socketActionTypes.SET_PLAYERS,
  payload: players,
});

export const setSocketId = (socketId) => ({
  type: socketActionTypes.SET_SOCKET_ID,
  payload: socketId,
});

export const setGameState = (gameState) => ({
  type: gameStateActionTypes.SET_GAME_STATE,
  payload: gameState,
});

export const addMessage = (message, color = "red", time = 5000) => ({
  type: messagesActionNames.ADD_MESSAGE,
  payload: {
    message,
    time,
    color,
  },
});

export const deleteMessage = (id) => ({
  type: messagesActionNames.DELETE_MESSAGE,
  payload: id,
});
