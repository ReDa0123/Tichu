import { any, equals, propSatisfies } from "ramda";

export const isCardInArray = (
  searchedValue = "NOT_IN",
  cards,
  propName = "name"
) => any(propSatisfies(equals(searchedValue), propName), cards);
