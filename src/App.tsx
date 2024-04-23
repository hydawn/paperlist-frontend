import { useState, useEffect } from 'react';
import LoginSignupPage from './LoginSignupPage.tsx'
import UserHomePage from './UserHomePage.tsx'

import axios from 'axios';

function checkUserLogin(setOnPage: Function) {
  axios.get('/api/get_user_loggedin/')
  .then(resp => {
    console.log('got resp:', resp)
    if (resp.data.loggedin) {
      console.log('is loggedin')
      setOnPage('home')
    } else {
      console.log('not loggedin yet')
      setOnPage('login')
    }
  }).catch(error => {
    console.error('error:', error)
    alert('unknown error')
  });
  return "good or bad, let's see console";
}


function App() {
  const [onPage, setOnPage] = useState('home');

  useEffect(() => {
    checkUserLogin(setOnPage);
  }, []);

  return (
    <>
      {onPage === "login" && <LoginSignupPage />}
      {onPage === "home" && <UserHomePage />}
    </>
  );
}

export default App
