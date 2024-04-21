import { useState } from "react";

function LoginWindow() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submitLogin() {
    console.log(`submit login username: [${username}] password: [${password}]`);
  }

  return (
    <>
    用户名：
    <input type="text" onChange={(e) => setUsername(e.target.value)}/>
    密码：
    <input type="password" onChange={(e) => setPassword(e.target.value)}/>
    <button onClick={submitLogin}>登录</button>
    </>
  );
}

function SignupWindow() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  function submitSignup() {
    console.log(`hit signup username: [${username}] password: [${password}]`);
  }

  return (
    <>
    用户名：
    <input type="text" onChange={(e) => setUsername(e.target.value)}/>
    密码：
    <input type="password" onChange={(e) => setPassword(e.target.value)}/>
    <button onClick={submitSignup}>注册</button>
    </>
  );
}

export default function LoginSignupPage() {
  const [atLogin, setAtLogin] = useState(true);

  function ChoseLoginSignup() {
    return (
      <>
        <button onClick={() => setAtLogin(true)}>登录</button>
        <button onClick={() => setAtLogin(false)}>注册</button>
      </>
    );
  }

  return (
    <>
      <ChoseLoginSignup />
      {atLogin ? <LoginWindow /> : <SignupWindow />}
    </>
  );
}
