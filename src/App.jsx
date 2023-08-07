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
    setLoading(true);
    axios.post('/api/openAi/go', {
      text: value,
      name: inputName || 'user'
    }).then(res => {
      console.log(res);
      if (!Array.isArray(res.data)) {
        message.error(res.data)
        return
      }
      setLoading(false);
      setValue('');
      setData(res.data);
      scrollToBottom();
    });
  };

  const getMessageList = () => {
    axios.post('/api/openAi/list', {
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

  const pay = () => {
    console.log(123);
    axios.post('/api/pay',{
      name: inputName || 'user'
    }).then((res)=>{
      window.open(res.data.url)
    })
   
  };

  const handleCancel = () => {
    getMessageList();
    setInputName('user');
    setIsModalVisible(false);
  };

  useEffect(() => {
    // getMessageList();

    scrollToBottom();
  }, [data]);

  return (
    <div className="App">
      <div className='top'>
        <Button type='primary' onClick={pay}>充值</Button>
        <Button type='primary' style={{marginLeft:20}}>清空数据</Button>
        <Button type='primary' style={{marginLeft:20}}>保留记录</Button>
      </div>
      <Modal title="输入用户名" open={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
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
          disabled={loading}
        />
        <Button className="send-button" type="primary" onClick={sendMessage} disabled={loading}>
          发送
        </Button>
      </div>
      <a style={{
        color:'#999',
        fontSize:'14px'
      }} href="https://beian.miit.gov.cn/" target="_blank">京ICP备2023016325号-1</a>
    </div>
  );
}

export default App