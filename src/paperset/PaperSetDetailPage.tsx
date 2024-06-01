import { PaperSetInfo, isPaperInfo } from "../Types"
import LoadingPage from "../LoadingPage";
import PaperListPage from "../paper/PaperListPage";
import { useState } from "react";
import PaperSetAddPaperPage from './edit/AddPaper';
import { HijackButtonProps } from "../listpage/ListPage.tsx";
import axios from "axios";
import ReloadContext from "../ReloadContext.tsx";

interface Props {
  paperSetInfo: PaperSetInfo
  jumpPaperPage: Function
}

export default function PaperSetDetailPage({paperSetInfo, jumpPaperPage}: Props) {
  const [onPage, setOnPage] = useState('detail');

  function PresentPaperSetDetail() {
    function Description() {
      return <>
        <div className="input-group mb-3">
          <span className="input-group-text">描述</span>
          <input type="text" className="form-control" value={paperSetInfo.description} readOnly disabled />
          <button
            className="input-group-text btn btn-primary"
            data-bs-toggle="collapse" data-bs-target="#collapsePaperSetDescription"
            aria-expanded="false" aria-controls="collapseExample">
            更多
          </button>
        </div>
        <div className="collapse mb-3" id="collapsePaperSetDescription">
          <div className="card card-body">
            {paperSetInfo.description}
          </div>
        </div>
        <div className="input-group mb-3">
          <button className="input-group-text btn btn-primary" onClick={() => { setOnPage('addpaper'); }} >
            添加论文
          </button>
        </div>
      </>;
    }

    const [message, setMessage] = useState<string | null>(null);

    function Alerts() {
      if (message === null)
        return <></>;
      return <div className="alert alert-success" role="alert" style={{ display: 'true' }}>
        {message}
      </div>;
    }

    const [reload, setReload] = useState(false);

    function HijackButton({className, item, index}: HijackButtonProps) {
      // use jumpPaperPage(item) to go to paper detail page
      // but we are creating a dropdown button here
      async function handleClickDelete() {
        if (!isPaperInfo(item)) {
          return;
        }
        await axios.post(
          '/api/delete_from_paperset',
          { papersetid: paperSetInfo.papersetid, paperid_list: [item.paperid] }
        ).then(resp => {
          console.log('got response', resp);
          setMessage('成功删除');
          setReload(!reload);
          // setOnPage(onPage === 'detail' ? 'alsodetail' : 'detail');
        }).catch(err => {
          console.error('error', err);
          setMessage(`删除失败： ${err.response.data.status}: ${err.response.data.error}`);
          setReload(!reload);
          // setOnPage(onPage === 'detail' ? 'alsodetail' : 'detail');
        })
      }

      if (index === 0)
        return <button className={className} disabled={true} />

      return <div className="btn-group">
        <button type="button" className={className + "btn btn-primary dropdown-toggle"} data-bs-toggle="dropdown" aria-expanded="false">
          更多
        </button>
        <ul className="dropdown-menu">
          <li><button className="dropdown-item btn btn-success" onClick={() => { jumpPaperPage(item) }}>论文详情</button></li>
          <li><button className="dropdown-item btn btn-danger" onClick={() => { handleClickDelete() }}>删除</button></li>
        </ul>
      </div>;
    }

    return <>
      <h1>{paperSetInfo.name}</h1>
      <Description />
      <Alerts />
      <ReloadContext.Provider value={reload}>
        <PaperListPage
          hijackSetSearchParam={(param) => { return {...param, papersetid: paperSetInfo.papersetid} }}
          HijackButton={HijackButton}
        />
      </ReloadContext.Provider>
    </>;
  }

  // <PaperSetReview paperInfo={paperInfo} />
  if (paperSetInfo === null)
    return <LoadingPage />;
  return <>
    { onPage === 'detail' && <PresentPaperSetDetail /> }
    { onPage === 'addpaper' && <PaperSetAddPaperPage paperSetInfo={paperSetInfo} onClickReturn={() => {setOnPage('detail');}} /> }
  </>
}
