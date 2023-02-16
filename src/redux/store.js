import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import {
  GAME_STATE_REDUCER_NAME,
  MESSAGES_REDUCER_NAME,
  SOCKET_REDUCER_NAME,
} from "./constants";
import { gameStateReducer, messagesReducer, socketReducer } from "./reducers";

const combinedReducer = combineReducers({
  [GAME_STATE_REDUCER_NAME]: gameStateReducer,
  [SOCKET_REDUCER_NAME]: socketReducer,
  [MESSAGES_REDUCER_NAME]: messagesReducer,
});

export default createStore(
  combinedReducer,
  composeWithDevTools(applyMiddleware(thunk))
);
