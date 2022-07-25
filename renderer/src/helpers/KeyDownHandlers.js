import {
  nonInsertionKey,
  V_KEYCODE,
  Y_KEYCODE,
  Z_KEYCODE,
  S_KEYCODE,
  ENTER_KEYCODE,
  OPEN_BRACKETS_KEYCODE,
  OPEN_PAREN_KEYCODE,
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

export const isMatchingChar = (e) => {
  return (
    e.keyCode == OPEN_BRACKETS_KEYCODE ||
    (e.keyCode == OPEN_PAREN_KEYCODE && e.shiftKey)
  );
};

export const isTab = (e) => {
  return e.keyCode == TAB_KEYCODE;
};

// if (
//   ((isMac && e.metaKey) || (!isMac && e.ctrlKey)) &&
//   e.keyCode == keys.S_KEYCODE
// ) {
