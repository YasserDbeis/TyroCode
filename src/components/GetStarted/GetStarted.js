import { set } from 'lodash';
import React from 'react';
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { getPWD, openFolderHandler } from '../../helpers/FileDirectory';
import { AiOutlineFolderOpen, AiOutlineFileAdd } from 'react-icons/ai';
import { HiOutlineCode } from 'react-icons/hi';
import { TiThMenuOutline } from 'react-icons/ti';
import { FaRegPlayCircle } from 'react-icons/fa';
import { IoIosArrowRoundForward } from 'react-icons/io';

const GetStarted = (props) => {
  return (
    <div
      style={{
        textAlign: 'center',
        color: 'white',
        height: props.windowHeight - props.terminalHeight,
        overflow: 'scroll',
        position: 'relative',
      }}
    >
      <div style={{ whiteSpace: 'nowrap' }}>
        <img
          style={{ display: 'inline-block', verticalAlign: 'middle' }}
          width={100}
          height={100}
          src="src/assets/TyroCode.png"
        ></img>
        <div style={{ display: 'inline-block', verticalAlign: 'middle' }}>
          <span
            style={{ fontSize: '72px', fontWeight: 'bolder', color: '#4D719B' }}
          >
            Tyro
          </span>
          <span style={{ fontSize: '72px', fontWeight: 'bolder' }}>Code</span>
        </div>
      </div>
      <span
        style={{
          fontSize: '32px',
          fontWeight: 'normal',
          fontStyle: 'italic',
        }}
      >
        More <span style={{ color: '#4D719B' }}>coding</span>, less{' '}
        <span style={{ color: '#8CC0DE' }}>tooling</span>.
      </span>

      {props.windowHeight - props.terminalHeight > 400 ? (
        <div style={{ margin: '75px' }}>
          <div>
            <span
              style={{
                fontSize: '22px',
              }}
            >
              Open a folder, create/edit files, select a language, &amp; run!
            </span>
          </div>
          <br />
          <div>
            <AiOutlineFolderOpen size={50} />
            <IoIosArrowRoundForward size={50} />
            <AiOutlineFileAdd size={50} />
            <IoIosArrowRoundForward size={50} />
            <HiOutlineCode size={50} />
            <IoIosArrowRoundForward size={50} />
            <TiThMenuOutline size={50} />
            <IoIosArrowRoundForward size={50} />
            <FaRegPlayCircle size={50} />
          </div>
        </div>
      ) : null}
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
          selecting a workspace folder
        </a>{' '}
        <br />
      </span>
    </div>
  );
};

export default GetStarted;
