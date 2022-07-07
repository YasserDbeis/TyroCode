export const waitForElm = (id) => {
  return new Promise((resolve) => {
    if (document.getElementById(id)) {
      return resolve(document.getElementById(id));
    }

    const observer = new MutationObserver((mutations) => {
      if (document.getElementById(id)) {
        resolve(document.getElementById(id));
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
};
