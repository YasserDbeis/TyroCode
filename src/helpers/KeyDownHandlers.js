import { nonInsertionKey } from '../enums/KeyboardCodes';

const isFunctionKey = (keyCode) => {
  return keyCode >= 112 && keyCode <= 123;
};

export const isNonInsertionKey = (keyCode) => {
  return !nonInsertionKey.includes(keyCode) && !isFunctionKey(keyCode);
};

export const isComboNonShiftKeyActive = (e) => {
  return e.metaKey || e.ctrlKey || e.altKey;
};
