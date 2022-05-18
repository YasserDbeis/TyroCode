import * as langs from '../enums/ProgLanguages';

export const getProgLanguage = (filename) => {
  let ext = getFileExtension(filename);

  if (ext == null || !langs.ext_to_lang.has(ext)) {
    return langs.none;
  }

  return langs.ext_to_lang.get(ext);
};

const getFileExtension = (filename) => {
  let lastPeriodIndex = filename.lastIndexOf('.');

  if (lastPeriodIndex == -1) {
    return null;
  }

  let ext = filename.slice(lastPeriodIndex + 1);

  return ext;
};
