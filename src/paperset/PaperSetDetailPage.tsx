import { PaperSetInfo } from "../Types"
import LoadingPage from "../LoadingPage";
import { useState } from "react";
import PaperSetAddPaperPage from './AddPaper';
import PresentPaperSetDetail from "./PresentPaperSetDetailPage";

interface Props {
  paperSetInfo: PaperSetInfo
  jumpPaperPage: Function
  jumpToPaperSetList: Function
}

export default function PaperSetDetailPage({paperSetInfo, jumpPaperPage, jumpToPaperSetList}: Props) {
  const [onPage, setOnPage] = useState('detail');

  if (paperSetInfo === null)
    return <LoadingPage />;
  return <>
    { onPage === 'detail' && <PresentPaperSetDetail paperSetInfo={paperSetInfo} jumpPaperPage={jumpPaperPage} setOnPage={setOnPage} jumpToPaperSetList={jumpToPaperSetList} /> }
    { onPage === 'addpaper' && <PaperSetAddPaperPage paperSetInfo={paperSetInfo} onClickReturn={() => {setOnPage('detail');}} /> }
  </>
}
