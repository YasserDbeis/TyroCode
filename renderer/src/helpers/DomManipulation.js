const setVisibility = (element, show) => {
  const visibility = show ? 'block' : 'none';

  if (element) {
    element.style.display = visibility;
  }
};

module.exports = {
  setVisibility,
};
