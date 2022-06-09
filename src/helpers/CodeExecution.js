var axios = require('axios');
var qs = require('qs');
const POST = 'post';
const CODEX_API_URL = 'https://codex-api.herokuapp.com/';
const CONTENT_TYPE = 'application/x-www-form-urlencoded';

const getDataQS = (language, code, input) => {
  return qs.stringify({
    language,
    code,
    input,
  });
};

const getConfig = (data) => {
  return {
    method: POST,
    url: CODEX_API_URL,
    headers: {
      'Content-Type': CONTENT_TYPE,
    },
    data: data,
  };
};

export const runCode = async (language, code, input) => {
  const data = getDataQS(language, code, input);
  const config = getConfig(data);

  const response = await axios(config);
  return response.data;
};
