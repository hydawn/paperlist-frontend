import { useState, useEffect } from 'react';
import axios from 'axios';

async function getUserInfo(setUserName: Function) {
  axios.get('/api/get_user_detail').then(resp => {
    setUserName(resp.data.username);
  }).catch(resp => {
    console.error('error getting user detail: ', resp);
  })
}

function getPaperInfo(paperId: string) {
  // request with userId, requestUserId, token
  return {
    paperName: 'Fake Paper',
    paperId: 'Fake Id', // md5 id
    publishDate: 'Fake Id',
    authorsIdList: ['0', '1'], // auther
  }
}

interface Props {
  setLoginStatus: Function
}

function LogoutButton({setLoginStatus}: Props) {
  async function handleLogout() {
    await axios.post('/api/logout')
    .then((_) => {
      console.log('user logout!')
      setLoginStatus(false)
    })
    .catch((resp) => {
      console.error('logout error: ', resp);
    });
  };

  return <button className="btn btn-primary" onClick={handleLogout}>登出</button>
}

export default function UserHomePage({setLoginStatus}: Props) {
  const [userName, setUserName] = useState('');
  useEffect(() => { getUserInfo(setUserName) }, []);

  return (
    <>
      <h1>用户名：{userName}</h1>
      <LogoutButton setLoginStatus={setLoginStatus} />
    </>
  );
}
