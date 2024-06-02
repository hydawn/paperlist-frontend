import { ItemType, PaperSetInfo, isPaperInfo } from "../Types"
import { useState } from "react";
import PaperListPage from "../paper/PaperListPage";
import { HijackButtonProps } from "../listpage/ListPage.tsx";
import axios from "axios";
import ReloadContext from "../ReloadContext.tsx";
import '../paper/PaperPage.css'

interface Props {
  paperSetInfo: PaperSetInfo
  onClickReturn: Function
}

export default function PaperSetAddPaperPage({paperSetInfo, onClickReturn}: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [reload, setReload] = useState(false);

  function Alerts() {
    if (message === null)
      return <></>;
    return <div className="alert alert-success" role="alert" style={{ display: 'true' }}>
      {message}
    </div>;
  }

  async function handleClickAdd(item: ItemType) {
    if (!isPaperInfo(item)) {
      return;
    }
    await axios.post(
      '/api/add_to_paperset',
      { papersetid: paperSetInfo.papersetid, paperid_list: [item.paperid] }
    ).then(resp => {
      console.log('got response', resp);
      setMessage('成功添加');
      setReload(!reload);
    }).catch(err => {
      console.error('error', err);
      setMessage(`添加失败： ${err.response.data.status}: ${err.response.data.error}`);
      setReload(!reload);
    })
  }

  function HijackButton({className, item, index}: HijackButtonProps) {
    if (index === 0)
      return <button className={className} disabled={true} />
    return <>
      <button
        type="button"
        className={className + " btn btn-primary"}
        onClick={() => { handleClickAdd(item) }}
      >
        添加
      </button>
    </>;
  }

  return <>
    <h1>添加论文</h1>
      <Alerts />
      <ReloadContext.Provider value={reload}>
        <PaperListPage
          hijackSetSearchParam={(param) => { return {...param, not__papersetid: paperSetInfo.papersetid} }}
          HijackButton={HijackButton}
        />
      </ReloadContext.Provider>
    <button className="btn btn-success" onClick={() => {onClickReturn()}}>返回</button>
  </>;
}
