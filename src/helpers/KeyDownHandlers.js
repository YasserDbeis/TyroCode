import { nonInsertionKey } from '../enums/KeyboardCodes';

const isFunctionKey = (keyCode) => {
  return keyCode >= 112 && keyCode <= 123;
};

const isArrowKey = (keyCode) => {
  return keyCode >= 37 && keyCode <= 40;
};

export const isNonInsertionKey = (keyCode) => {
  return (
    !nonInsertionKey.includes(keyCode) &&
    !isFunctionKey(keyCode) &&
    !isArrowKey(keyCode)
  );
};

export const isComboNonShiftKeyActive = (e) => {
  return e.metaKey || e.ctrlKey || e.altKey;
};
