var axios = require('axios');
var qs = require('qs');
var data = qs.stringify({
  code: 'import java.util.Scanner;\npublic class MatSym {\n    public static void main(String[]args) {\n       Scanner in = new Scanner(System.in);\nSystem.out.println(in.nextLine());\nSystem.out.println(in.nextLine());\n    }\n}',
  language: 'java',
  input: 'Hello\nWorld',
});
var config = {
  method: 'post',
  url: 'https://codex-api.herokuapp.com/',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
  data: data,
};

export const testAPI = () => {
  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data));
    })
    .catch(function (error) {
      console.log(error);
    });
};
