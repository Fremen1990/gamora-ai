import gamoraAiDark from '../assets/images/gamora-dark.png';

import { Avatar, Button, ConfigProvider, Layout, Typography } from 'antd';
import { Input, Space, Alert } from 'antd';

const { TextArea } = Input;

export function App() {
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
        <Avatar
          icon={<img src={gamoraAiDark} alt="" />}
          style={{ width: 250, height: 250 }}
        />

        <TextArea
          rows={4}
          placeholder="Ask me something..."
          maxLength={6}
          size="middle"
          style={{
            width: '80%',
            backgroundColor: '#7f7f7f',
            padding: '10px',
            margin: '20px',
          }}
        />

        <Button type="primary" size="middle">
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
          description="Info Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info DescriptionInfo Description Info Description Info Description Info Description"
          type="success"
        />
      </Layout>
    </ConfigProvider>
  );
}

export default App;
