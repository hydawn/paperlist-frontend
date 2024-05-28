import { useState, useEffect } from 'react';
import LoginSignupPage from './LoginSignupPage.tsx'
import UserHomePage from './UserHomePage.tsx'

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

  if (loginStatus)
    return <UserHomePage setLoginStatus={setLoginStatus} />;
  return <LoginSignupPage setLoginStatus={setLoginStatus} />
}
