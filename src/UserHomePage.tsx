import { useState } from 'react';
import InfoPage from './userhome/InfoPage.tsx';
import PaperPage from './paper/PaperPage.tsx';
import AddPaper from './userhome/AddPaper.tsx';
import {PaperInfo} from './Types.tsx';
import PaperSetPage from './paperset/PaperSetPage.tsx';
import AddPaperSet from './paperset/AddPaperSet.tsx';

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
        <li><a className="dropdown-item" role="button" onClick={() => { setPage('添加论文') }}>论文</a></li>
        <li><a className="dropdown-item" role="button" onClick={() => { setPage('添加论文库') }}>论文库</a></li>
      </ul>
    </li>;
  }

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
  const [page, setPage] = useState('信息');
  // const [givenPaperInfo, setGivenPaperInfo] = useState<PaperInfo | null>(null);
  //  <TopNavBar page={page} setPage={setPage} />
  //   {page === '论文' && <PaperPage givenPaperInfo={givenPaperInfo} />}
  //   {page === '论文库' && <PaperSetPage jumpPaperPage={(paperInfo: PaperInfo) => { setPage('论文'); setGivenPaperInfo(paperInfo)}} />}
  //   {page === '添加论文' && <AddPaper />}
  //   {page === '添加论文库' && <AddPaperSet />}

  return (<>
    {page === '信息' && <InfoPage setLoginStatus={setLoginStatus} />}
  </>);
}
