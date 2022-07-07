let baseLineStyle = {
  color: 'whitesmoke',
  backgroundColor: 'transparent',
  float: 'right',
};

let runButtonStyle = {
  cursor: 'pointer',
  ...baseLineStyle,
};

let runButtonLoadingStyle = {
  cursor: 'none',
  fontSize: '25px',
  ...baseLineStyle,
};

module.exports = {
  runButtonLoadingStyle,
  runButtonStyle,
};
