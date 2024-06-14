import { useState, useEffect } from 'react';
import axios from 'axios';

interface Props {
  setLoginStatus: Function
}

async function getUserInfo(setUserName: Function) {
  axios.get('/api/get_user_detail').then(resp => {
    setUserName(resp.data.username);
  }).catch(resp => {
    console.error('error getting user detail: ', resp);
  })
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

function LogoffButton({setLoginStatus}: Props) {
  async function handleLogoff() {
    await axios.post('/api/logoff')
    .then((_) => {
      console.log('user logoff!')
      setLoginStatus(false)
    })
    .catch((resp) => {
      console.error('logout error: ', resp);
    });
  };
  return <button className="btn btn-primary" onClick={handleLogoff}>注销</button>
}

export default function InfoPage({setLoginStatus}: Props) {
  const [userName, setUserName] = useState('');
  useEffect(() => { getUserInfo(setUserName) }, []);

  return <>
    <h1>用户名：{userName}</h1>
    <LogoutButton setLoginStatus={setLoginStatus} />
    <LogoffButton setLoginStatus={setLoginStatus} />
  </>;
}
