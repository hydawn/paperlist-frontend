import { useState, useEffect } from 'react';
import LoginSignupPage from './LoginSignupPage.tsx'
import LoadingPage from './LoadingPage.tsx';
import MainPage from './MainPage.tsx';

import axios from 'axios';

function checkUserLogin(setLoginStatus: Function) {
  axios.get('/api/get_user_loggedin')
  .then(resp => {
    console.log('got resp:', resp)
    if (resp.data.loggedin) {
      console.log('is loggedin');
      setLoginStatus(true);
    } else {
      console.log('not loggedin yet');
      setLoginStatus(false);
    }
  }).catch(error => {
    console.error('error:', error);
  });
  return "good or bad, let's see console";
}

export default function App() {
  const [loginStatus, setLoginStatus] = useState<boolean | null>(null);

  useEffect(() => { checkUserLogin(setLoginStatus); }, []);

  if (loginStatus === null)
    return <LoadingPage />;
  if (loginStatus)
    return <MainPage setLoginStatus={setLoginStatus} />;
  return <LoginSignupPage setLoginStatus={setLoginStatus} />
}
