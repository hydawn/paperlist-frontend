import { useRef, useState } from "react";
import axios from "axios";
import SideBar from "./SideBar";
import { Container, Row, Col } from 'react-bootstrap';
import { handleError } from "./Functions";

interface LoginProps {
  setLoginStatus: Function
}

function LoginWindow({setLoginStatus}: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  async function submitLogin() {
    console.log(`submit login username: [${username}] password: [${password}]`);
    await axios.post(
      '/api/login',
      {username: username, password: password}
    )
    .then(resp => {
      console.log('good:', resp);
      setLoginStatus(true);
    })
    .catch(handleError)
  }

  return (
    <>
    <div className="mb-3">
      <label htmlFor="inputUsername" className="form-label">用户名</label>
      <input id="inputUsername" className="form-control" type="text" onBlur={(e) => setUsername(e.target.value)} />
    </div>
    <div className="mb-3">
      <label htmlFor="inputPassword" className="form-label">密码</label>
      <input id="inputPassword" className="form-control" type="password" onBlur={(e) => setPassword(e.target.value)} />
    </div>
    <button className="btn btn-primary" onClick={submitLogin}>登录</button>
    </>
  );
}

interface SignupProps {
  backToLogin: Function
}

function SignupWindow({backToLogin}: SignupProps) {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  async function submitSignup() {
    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const email = emailRef.current?.value || '';
    console.log(`hit signup username: [${username}] email: [${email}]`);
    await axios.post(
      '/api/signup',
      {username: username, password: password, email: email}
    )
    .then(resp => {
      console.log('signup success:', resp);
      alert('signup success');
      backToLogin();
    })
    .catch(handleError)
  }

  console.log('load signup window')

  return (<>
    <div className="mb-3">
      <label htmlFor="inputUsername" className="form-label">用户名</label>
      <input id="inputUsername" className="form-control" type="text" ref={usernameRef} />
    </div>
    <div className="mb-3">
      <label htmlFor="inputEmail" className="form-label">邮箱</label>
      <input id="inputEmail" className="form-control" type="text" ref={emailRef} />
    </div>
    <div className="mb-3">
      <label htmlFor="inputPassword" className="form-label">密码</label>
      <input id="inputPassword" className="form-control" type="password" ref={passwordRef} />
    </div>
    <button className="btn btn-primary" onClick={submitSignup}>注册</button>
  </>);
}

export default function LoginSignupPage({setLoginStatus}: LoginProps) {
  const [onPage, setOnPage] = useState('登录');

  // set page back to login page
  // for signup page to use after signup success
  function backToLogin() {
    setOnPage('登录');
  }

  return <Container fluid>
    <Row>
      <Col xs={2} id="sidebar-wrapper">
        <SideBar onPage={onPage} setOnPage={setOnPage} sideBarNames={['登录', '注册']} />
      </Col>
      <Col xs={10} id="main-content-wrapper">
        {onPage === '登录' ? <LoginWindow setLoginStatus={setLoginStatus} /> : <SignupWindow backToLogin={backToLogin} />}
      </Col>
    </Row>
  </Container>;
}
