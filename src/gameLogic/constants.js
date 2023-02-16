import { keyMirror } from "ramda-extension";

export const NUMBERS = keyMirror({
  1: null,
  2: null,
  3: null,
  4: null,
  5: null,
  6: null,
  7: null,
  8: null,
  9: null,
  10: null,
  J: null,
  Q: null,
  K: null,
  A: null,
});

export const VALUES = {
  [NUMBERS[1]]: 1,
  [NUMBERS[2]]: 2,
  [NUMBERS[3]]: 3,
  [NUMBERS[4]]: 4,
  [NUMBERS[5]]: 5,
  [NUMBERS[6]]: 6,
  [NUMBERS[7]]: 7,
  [NUMBERS[8]]: 8,
  [NUMBERS[9]]: 9,
  [NUMBERS[10]]: 10,
  [NUMBERS.J]: 11,
  [NUMBERS.Q]: 12,
  [NUMBERS.K]: 13,
  [NUMBERS.A]: 14,
  0.5: 0.5,
  1.5: 1.5,
  2.5: 2.5,
  3.5: 3.5,
  4.5: 4.5,
  5.5: 5.5,
  6.5: 6.5,
  7.5: 7.5,
  8.5: 8.5,
  9.5: 9.5,
  10.5: 10.5,
  11.5: 11.5,
  12.5: 12.5,
  13.5: 13.5,
  14.5: 14.5,
  25: 25,
};

export const SPECIAL_CARDS = keyMirror({
  DOG: null,
  PHOENIX: null,
  MAHJONG: null,
  DRAGON: null,
});

export const COMBINATIONS = keyMirror({
  SINGLE: null,
  PAIR: null,
  TRIPLE: null,
  FULL_HOUSE: null,
  STRAIGHT: null,
  BOMB4: null,
  BOMB_STRAIGHT: null,
});

export const BOMBS = [COMBINATIONS.BOMB4, COMBINATIONS.BOMB_STRAIGHT];

export const GAME_PARTS = keyMirror({
  SMALL_TICHU: null,
  BIG_TICHU: null,
  SEND_CARDS: null,
  PLAY_CARDS: null,
  TURN_END: null,
});
