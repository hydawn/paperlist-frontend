import { useState } from "react";
import './PaperPage.css'
import PaperDetailPage from "./PaperDetailPage.tsx";
import AddPaper from "../userhome/AddPaper.tsx";
import PaperListPage from "./PaperListPage.tsx";
import { PaperInfo } from "./Types.tsx";

interface TopNavBarProps {
  windowList: Array<string>
  onWindow: string
  setOnWindow: Function
  disableThis: Function
}

function TopNavBar({windowList, onWindow, setOnWindow, disableThis}: TopNavBarProps) {
  function NonDropdownButtons() {
    return windowList.map(item => (
      <li className="nav-item">
        <a className={"nav-link" + (item == onWindow ? " active" : (disableThis(item) ? " disabled" : ""))} role="button" aria-current="page" onClick={() => {setOnWindow(item)}}>{item}</a>
      </li>
    ))
  }
  return <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div className="container-fluid">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <NonDropdownButtons />
        </ul>
      </div>
    </div>
  </nav>;
}

export default function PaperPage() {
  const [onWindow, setOnWindow] = useState<string>('论文列表');
  const [paperInfo, setPaperInfo] = useState<PaperInfo | null>(null);
  const windowList = ['论文列表', '论文详情', '添加论文'];

  function disableWindow(window: string) {
    if (window === '论文详情' && paperInfo === null)
      return true;
    return false;
  }

  console.log('onWindow is ', onWindow);

  return <>
    <TopNavBar windowList={windowList} onWindow={onWindow} setOnWindow={setOnWindow} disableThis={disableWindow} />
    { onWindow === '论文列表' && <PaperListPage setPaperInfo={(paperInfo: PaperInfo) => {setPaperInfo(paperInfo); setOnWindow('论文详情')}} /> }
    { onWindow === '论文详情' && paperInfo && <PaperDetailPage inputPaperInfo={paperInfo} /> }
    { onWindow === '添加论文' && <AddPaper /> }
  </>;
}
