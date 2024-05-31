import { useState } from "react";
import './PaperPage.css'
import PaperDetailPage from "./PaperDetailPage.tsx";
import AddPaper from "../userhome/AddPaper.tsx";
import PaperListPage from "./PaperListPage.tsx";
import { PaperInfo } from "../Types.tsx";
import TopNavBar from '../TopNavBar.tsx';

interface Props {
  givenPaperInfo: PaperInfo | null
}

export default function PaperPage({givenPaperInfo}:Props ) {
  const [onWindow, setOnWindow] = useState<string>('论文列表');
  const [paperInfo, setPaperInfo] = useState<PaperInfo | null>(givenPaperInfo);
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
