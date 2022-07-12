import React from 'react';

export const getCustomScrollbar = ({ style, ...props }) => {
  // const { top } = this.state;
  // const color = top * 255;
  const customStyle = {
    color: 'black',
  };
  return <div {...props} style={{ ...style, ...customStyle }} />;
};
