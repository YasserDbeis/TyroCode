import { set } from 'lodash';
import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { getPWD, openFolderHandler } from '../../helpers/FileDirectory';
import { AiOutlineFolderOpen } from 'react-icons/ai';

const GetStarted = (props) => {
  return (
    <div
      style={{
        textAlign: 'center',
        color: 'white',
        padding: '10px',
        height: props.windowHeight - props.terminalHeight,
        overflow: 'scroll',
        position: 'relative',
      }}
    >
      <span
        style={{ fontSize: '48px', fontWeight: 'bolder', color: '#4D719B' }}
      >
        Tyro
      </span>
      <span style={{ fontSize: '48px', fontWeight: 'bolder' }}>Code</span>
      <br />
      <span
        style={{ fontSize: '28px', fontWeight: 'normal', fontStyle: 'italic' }}
      >
        Focus on coding, not tooling.
      </span>
      <br style={{ display: 'block', marginTop: '150px', content: ' " " ' }} />
      <span
        style={{
          fontSize: '18px',
          fontWeight: 'normal',
          position: 'absolute',
          bottom: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        Get started by{' '}
        <a
          style={{ color: '#8CC0DE' }}
          onClick={() => openFolderHandler(props.onFolderSelection)}
        >
          selecting a workspace folder <AiOutlineFolderOpen size={24} />
        </a>{' '}
        <br />
      </span>
    </div>
  );
};

export default GetStarted;
