export const TAB_KEYCODE = 9;
export const ENTER_KEYCODE = 13;
export const SHIFT_KEYCODE = 16;
export const CTRL_KEYCODE = 17;
export const ALT_OR_OPT_KEYCODE = 18;
export const CAPS_LOCK_KEYCODE = 20;
export const ESCAPE_KEYCODE = 27;
export const OPENING_PAREN_KEYCODE = 57;
export const CLOSING_PAREN_KEYCODE = 48;
export const S_KEYCODE = 83;
export const V_KEYCODE = 86;
export const Y_KEYCODE = 89;
export const Z_KEYCODE = 90;
export const LEFT_META_KEYCODE = 91;
export const RIGHT_META_KEYCODE = 93;
export const OPENING_BRACKETS_KEYCODE = 219;
export const CLOSING_BRACKETS_KEYCODE = 221;

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
