import gamoraAiDark from '../assets/images/gamora-dark.png';

import {
  Avatar,
  Button,
  ConfigProvider,
  Layout,
  Progress,
  Typography,
} from 'antd';
import { Input, Space, Alert } from 'antd';
import axios from 'axios';
import { useEffect, useState } from 'react';

const { TextArea } = Input;

const ProgressCircle = ({ duration }: { duration: number }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const intervalDuration = duration * 10;
    const interval = setInterval(() => {
      setPercent((prevPercent) => prevPercent + 1);
    }, intervalDuration);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <div
      style={{
        position: 'fixed',
        zIndex: 999,
        height: '100vh',
        width: '100vw',
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/*<Spin style={{ width: '300px', height: '300px' }} />*/}
      <Progress
        type="circle"
        percent={percent}
        strokeColor={{ '0%': '#108ee9', '100%': '#87d068' }}
        showInfo={true}
      />
    </div>
  );
};

export function App() {
  const [apiStatus, setApiStatus] = useState({});
  const [questionInput, setQuestionInput] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const apiHealthCheckApi = async () =>
    await axios.get('http://localhost:3000/api');

  const questionApi = async (question: string) =>
    await axios.post('http://localhost:3000/api/messages', {
      message: question,
    });

  const handleAskQuestion = async () => {
    setIsLoading(true);
    const answer = await questionApi(questionInput);
    setAnswer(answer.data);
    setIsLoading(false);
    console.log('anser', answer);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await apiHealthCheckApi();
        setApiStatus(response.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#274916',
        },
      }}
    >
      <Layout
        style={{
          backgroundColor: '#141414',
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {isLoading && <ProgressCircle duration={2} />}
        <Typography
          style={{
            fontSize: '34px',
            fontWeight: 'bold',
            color: '#274916',
            padding: '10px',
            margin: '20px',
          }}
        >
          Gamora AI
        </Typography>
        <Typography
          style={{
            fontSize: '14px',
            fontWeight: 'bold',
            color: '#274916',
            padding: '5px',
            margin: '5px',
          }}
        >
          API status: {JSON.stringify(apiStatus)}
        </Typography>
        <Avatar
          icon={<img src={gamoraAiDark} alt="" />}
          style={{ width: 250, height: 250 }}
        />
        <TextArea
          rows={5}
          placeholder="Ask me something..."
          maxLength={20000}
          size="middle"
          style={{
            width: '80%',
            backgroundColor: '#919090',
            padding: '10px',
            margin: '20px',
          }}
          onChange={(e) => setQuestionInput(e.target.value)}
        />
        <Button
          type="primary"
          size="middle"
          onClick={handleAskQuestion}
          disabled={isLoading}
        >
          Button
        </Button>
        <Space size="large" />
        <Alert
          style={{
            backgroundColor: '#d5f2bb',
            width: '80%',
            padding: '10px',
            margin: '20px',
          }}
          description={answer ? answer : 'No answer yet'}
          type="success"
        />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
