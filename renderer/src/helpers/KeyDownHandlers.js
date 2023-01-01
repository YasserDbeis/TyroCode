import {
  nonInsertionKey,
  V_KEYCODE,
  Y_KEYCODE,
  Z_KEYCODE,
  S_KEYCODE,
  ENTER_KEYCODE,
  OPENING_BRACKETS_KEYCODE,
  OPENING_PAREN_KEYCODE,
  CLOSING_BRACKETS_KEYCODE,
  CLOSING_PAREN_KEYCODE,
  TAB_KEYCODE,
} from '../enums/KeyboardCodes';
import os from 'os';

const MAC_PLATFORM = 'darwin';
const WIN_PLATFORM = 'win32';

const isMac = os.platform() == MAC_PLATFORM;
const isWin = os.platform() == WIN_PLATFORM;

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

export const isPasteKeyCombo = (e) => {
  return e.metaKey && e.keyCode == V_KEYCODE;
};

export const isRedo = (e) => {
  return (
    (isMac && e.metaKey && e.shiftKey && e.keyCode == Z_KEYCODE) ||
    (isWin && e.ctrlKey && e.keyCode == Y_KEYCODE)
  );
};

export const isUndo = (e) => {
  return (
    (isMac && e.metaKey && e.keyCode == Z_KEYCODE) ||
    (isWin && e.ctrlKey && e.keyCode == Y_KEYCODE)
  );
};

export const isSave = (e) => {
  return (
    ((isMac && e.metaKey) || (isWin && e.ctrlKey)) && e.keyCode == S_KEYCODE
  );
};

export const isEnter = (e) => {
  return e.keyCode == ENTER_KEYCODE;
};

export const isOpeningChar = (e) => {
  return (
    e.keyCode == OPENING_BRACKETS_KEYCODE ||
    (e.keyCode == OPENING_PAREN_KEYCODE && e.shiftKey)
  );
};

export const isClosingChar = (e) => {
  return (
    e.keyCode == CLOSING_BRACKETS_KEYCODE ||
    (e.keyCode == CLOSING_PAREN_KEYCODE && e.shiftKey)
  );
};

export const areMatchingChars = (prevChar, currChar) => {
  return (
    (prevChar.keyCode == OPENING_PAREN_KEYCODE &&
      currChar.keyCode == CLOSING_PAREN_KEYCODE) ||
    (prevChar.shiftKey == currChar.shiftKey &&
      prevChar.keyCode == OPENING_BRACKETS_KEYCODE &&
      currChar.keyCode == CLOSING_BRACKETS_KEYCODE)
  );
};

export const isTab = (e) => {
  return e.keyCode == TAB_KEYCODE;
};

// if (
//   ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) &&
//   e.keyCode == keys.S_KEYCODE
// ) {
