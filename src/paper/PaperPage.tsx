import { useState } from "react";
import './PaperPage.css'
import PaperDetailPage from "./PaperDetailPage.tsx";
import AddPaper, {noHijack} from "../userhome/AddPaper.tsx";
import PaperListPage from "./PaperListPage.tsx";
import { PaperInfo, isPaperInfo } from "../Types.tsx";
import { HijackButtonProps } from "../listpage/ListPage.tsx";
import TopNavBar from '../TopNavBar.tsx';
import axios from 'axios';

interface Props {
  givenPaperInfo: PaperInfo | null
}

export default function PaperPage({givenPaperInfo}:Props ) {
  const [onWindow, setOnWindow] = useState<string>(givenPaperInfo === null ? '论文列表' : '论文详情');
  const [paperInfo, setPaperInfo] = useState<PaperInfo | null>(givenPaperInfo);
  const windowList = ['论文列表', '论文详情', '添加论文'];

  function disableWindow(window: string) {
    if (window === '论文详情' && paperInfo === null)
      return true;
    return false;
  }

  function HijackButton({className, item, index}: HijackButtonProps) {
    return <button
      className={className}
      disabled={index === 0}
      onClick={() => {
        if (isPaperInfo(item)) {
          setPaperInfo(item);
          setOnWindow('论文详情');
        }
      }}
    >{index === 0 ? "" : "更多"}</button>
  }

  async function reloadPaperInfo(givenPaperInfo: PaperInfo | null) {
    if (paperInfo === null)
      return;
    if (givenPaperInfo === null) {
      await axios.get('/api/paper_detail', {params: {paperid: paperInfo.paperid}}).then(resp => {
        console.log(`got reloaded paper detail [${resp.data.data}]`);
        setPaperInfo(resp.data.data);
      }).catch(err => {
        console.error('got error', err)
      });
      return;
    }
    console.log(`set paper info to ${givenPaperInfo?.title}`)
    setPaperInfo(givenPaperInfo);
  }

  return <>
    <TopNavBar windowList={windowList} onWindow={onWindow} setOnWindow={setOnWindow} disableThis={disableWindow} />
    { onWindow === '论文列表' && <PaperListPage
      hijackSetSearchParam={(p)=>{return p}}
      HijackButton={HijackButton}
    /> }
    { onWindow === '论文详情' && paperInfo && <PaperDetailPage paperInfo={paperInfo} reloadPaperInfo={reloadPaperInfo} jumpToPaperList={() => setOnWindow('论文列表')} /> }
    { onWindow === '添加论文' && <AddPaper paperInfo={null} hijackPost={noHijack} /> }
  </>;
}
