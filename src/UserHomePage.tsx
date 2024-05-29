import { useState } from 'react';
import InfoPage from './userhome/InfoPage';

interface Props {
  setLoginStatus: Function
}

interface TopNavBarProps {
  page: string,
  setPage: Function
}

function TopNavBar({page, setPage}: TopNavBarProps) {
  const pageList = ['信息', '论文', '论文库']

  function NonDropdownButtons() {
    return pageList.map(item => (
      <li className="nav-item">
        <a className={"nav-link" + (item == page ? " active" : "")} role="button" aria-current="page" onClick={() => {setPage(item)}}>{item}</a>
      </li>
    ))
  }

  function DropdownButton() {
    return <li className="nav-item dropdown">
      <a className="nav-link dropdown-toggle" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        添加
      </a>
      <ul className="dropdown-menu">
        <li><a className="dropdown-item" onClick={() => { setPage('添加论文') }}>论文</a></li>
        <li><a className="dropdown-item" onClick={() => { setPage('添加论文库') }}>论文库</a></li>
      </ul>
    </li>;
  }

  /*
    <div className="d-flex" role="search">
      <input className="form-control me-2" type="search" placeholder={"搜索" + page} aria-label="Search" />
      <button className="btn btn-outline-success" type="submit">搜索</button>
    </div>
  */

  return <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div className="container-fluid">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <NonDropdownButtons />
          <DropdownButton />
        </ul>
      </div>
    </div>
  </nav>;
}

export default function UserHomePage({setLoginStatus}: Props) {
  // info, paper, paperset, addpaper, addpaperset
  const [page, setPage] = useState('信息');

  return (<>
    <TopNavBar page={page} setPage={setPage} />
    {page === '信息' && <InfoPage setLoginStatus={setLoginStatus} />}
    {page === '论文' && <h1>Papers</h1>}
    {page === '论文库' && <h1>Paper Set</h1>}
    {page === '添加论文' && <h1>Add Paper</h1>}
    {page === '添加论文库' && <h1>Add Paper Set</h1>}
  </>);
}
