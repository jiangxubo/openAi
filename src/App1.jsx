import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Input, Button, Modal, message } from 'antd';
import './index.scss';

const { TextArea } = Input;

function App() {
  const [data, setData] = useState([]);
  const [value, setValue] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(true);
  const [inputName, setInputName] = useState('');
  const [loading, setLoading] = useState(false);
  const messageListRef = useRef(null);

  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  };

  const sendMessage = () => {
    // setLoading(true);
    axios.post('/api/go', {
      text: value,
      name: inputName || 'user'
    }).then(res => {
      setLoading(false);
      setValue('');
      setData(res.data);
      scrollToBottom();
    });


    // this.source = new EventSource('/sse');
    //         //监听message事件
    //         this.source.onmessage = (res) => {
    //             let { data } = JSON.parse(res.data);
    //             this.message = data;
    //         };
    //         //监听自定义customEvents事件
    //         this.source.addEventListener('customEvents', (res) => {
    //             let { data } = JSON.parse(res.data);
    //             this.customEvents = data;
    //         });

  };

  const getMessageList = () => {
    axios.post('/api/list', {
      name: inputName || 'user'
    }).then(res => {
      if(res === '错误'){
        message.error('错误')
      }else{
        setData(res.data);
        scrollToBottom();
      }
    });
  };

  const handleOk = () => {
    getMessageList();
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    getMessageList();
    setInputName('user');
    setIsModalVisible(false);
  };

  useEffect(() => {
    getMessageList();

    scrollToBottom();
  }, []);

  return (
    <div className="App">
      <Modal title="输入用户名" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Input placeholder="请输入用户名" value={inputName} onChange={e => setInputName(e.target.value)} />
      </Modal>
      <div className="message-list" ref={messageListRef}>
        {data.map((item, index) => (
          <div key={index} className={`message-item ${item.role}`}>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{item.content}</pre>
          </div>
        ))}
      </div>
      <div className="input-container">
        <TextArea
          className="input-textarea"
          rows={4}
          value={value}
          onChange={e => setValue(e.target.value)}
          // disabled={loading}
        />
        <Button className="send-button" type="primary" onClick={sendMessage} disabled={loading}>
          发送
        </Button>
      </div>
    </div>
  );
}

export default App