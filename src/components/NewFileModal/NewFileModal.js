import React from 'react';
import { Button, Modal, Input } from 'antd';
import { useState } from 'react';
import { AiOutlineFileAdd } from 'react-icons/ai';
import newFileIconStyle from '../../styles/NewFileIcon';
import isValidFilename from 'valid-filename';

const NewFileModal = (props) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [filenameValidationStatus, setFilenameValidationStatus] =
    useState(null);
  const [filename, setFileName] = useState(null);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    if (isValidFilename(filename)) {
      setIsModalVisible(false);
      console.log('SUCCESS', filename);
      setFilenameValidationStatus(null);
      setFileName('');
    } else {
      setFilenameValidationStatus('error');
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <>
      <AiOutlineFileAdd
        style={newFileIconStyle}
        size={25}
        onClick={showModal}
      ></AiOutlineFileAdd>
      <Modal
        title="File Name Input"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Input
          value={filename}
          onChange={(e) => {
            setFileName(e.target.value);
          }}
          allowClear={true}
          status={filenameValidationStatus}
        />
      </Modal>
    </>
  );
};

export default NewFileModal;
