import { useState } from "react";
import { PaperSetInfo } from "../Types.tsx";
import TopNavBar from '../TopNavBar.tsx';
import AddPaperSet from "./AddPaperSet.tsx";
import PaperSetListPage from "./PaperSetListPage.tsx";
import PaperSetDetailPage from "./PaperSetDetailPage.tsx";

interface Props {
  jumpPaperPage: Function
}

export default function PaperSetPage({jumpPaperPage}: Props) {
  const [onWindow, setOnWindow] = useState<string>('论文库列表');
  const [paperSetInfo, setPaperSetInfo] = useState<PaperSetInfo | null>(null);
  const windowList = ['论文库列表', '论文库详情', '添加论文库'];

  function disableWindow(window: string) {
    if (window === '论文库详情' && paperSetInfo === null)
      return true;
    return false;
  }

  console.log('onWindow is ', onWindow);

  return <>
    <TopNavBar windowList={windowList} onWindow={onWindow} setOnWindow={setOnWindow} disableThis={disableWindow} />
    { onWindow === '论文库列表' && <PaperSetListPage setPaperSetInfo={(paperSetInfo: PaperSetInfo) => {setPaperSetInfo(paperSetInfo); setOnWindow('论文库详情')}} /> }
    { onWindow === '论文库详情' && paperSetInfo && <PaperSetDetailPage paperSetInfo={paperSetInfo} jumpPaperPage={jumpPaperPage} /> }
    { onWindow === '添加论文库' && <AddPaperSet /> }
  </>;
}
