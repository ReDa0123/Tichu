import {
  gameStateActionTypes,
  messagesActionNames,
  socketActionTypes,
} from "./constants";
import { filter, prop, propOr } from "ramda";

export const gameStateReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case gameStateActionTypes.SET_GAME_STATE:
      return payload;
    default:
      return state;
  }
};

export const socketReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case socketActionTypes.SET_PLAYERS:
      return {
        ...state,
        players: payload,
      };
    case socketActionTypes.INITIALIZE:
      return {
        ...state,
        initialized: payload,
      };
    case socketActionTypes.SET_SOCKET_ID:
      return {
        ...state,
        socketId: payload,
      };
    default:
      return state;
  }
};

export const messagesReducer = (state = {}, { type, payload }) => {
  switch (type) {
    case messagesActionNames.ADD_MESSAGE: {
      const newId = propOr(-1, "currentId", state) + 1;

      return {
        ...state,
        currentId: newId,
        displayed: [
          ...propOr([], "displayed", state),
          {
            id: newId,
            ...payload,
          },
        ],
      };
    }
    case messagesActionNames.DELETE_MESSAGE: {
      return {
        ...state,
        displayed: filter(
          (message) => message.id !== payload,
          prop("displayed", state)
        ),
      };
    }
    default: {
      return state;
    }
  }
};
