export const TAB_KEYCODE = 9;
export const Z_KEYCODE = 90;
export const V_KEYCODE = 86;
export const ESCAPE_KEYCODE = 27;
export const OPEN_PAREN_KEYCODE = 57;
export const OPEN_BRACKETS_KEYCODE = 219;
export const CAPS_LOCK_KEYCODE = 20;
export const LEFT_META_KEYCODE = 91;
export const RIGHT_META_KEYCODE = 93;
export const CTRL_KEYCODE = 17;
export const SHIFT_KEYCODE = 16;
export const ALT_OR_OPT_KEYCODE = 18;
export const ENTER_KEYCODE = 13;
export const S_KEYCODE = 83;

export const comboKeys = [
  LEFT_META_KEYCODE,
  RIGHT_META_KEYCODE,
  CTRL_KEYCODE,
  SHIFT_KEYCODE,
  ALT_OR_OPT_KEYCODE,
];

export const nonInsertionKey = [
  ESCAPE_KEYCODE,
  CAPS_LOCK_KEYCODE,
  ...comboKeys,
];
