import { keyMirror } from "ramda-extension";

export const roomStatuses = keyMirror({
  ROOM_SELECT: null,
  WAITING_FOR_PLAYERS: null,
});
