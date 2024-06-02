import { PaperSetInfo, isPaperInfo } from "../Types"
import { useState, useEffect } from "react";
import PaperListPage from "../paper/PaperListPage";
import { HijackButtonProps } from "../listpage/ListPage.tsx";
import axios from "axios";
import ReloadContext from "../ReloadContext.tsx";
import PaperSetReview from "./PaperReview.tsx";
import {handleError} from "../ReviewPage.tsx";

interface Props {
  paperSetInfo: PaperSetInfo
  jumpPaperPage: Function
  setOnPage: Function
  jumpToPaperSetList: Function
}

interface DescriptionProps {
  paperSetInfo: PaperSetInfo
  setOnPage: Function
  userId: string | null
  setPaperSetDeleteMessage: Function
}

function Description({paperSetInfo, setOnPage, userId, setPaperSetDeleteMessage }: DescriptionProps) {
  function AddPaperButton() {
    if (userId && userId == paperSetInfo.userid) {
      return <button className="input-group-text btn btn-primary" onClick={() => { setOnPage('addpaper'); }} >
        添加论文
      </button>;
    }
    return <></>;
  }

  function DeletePaperSetButton() {
    if (userId && userId == paperSetInfo.userid) {
      return <button className="input-group-text btn btn-danger" onClick={async () => {
        await axios.post('/api/delete_paperset', { papersetid: paperSetInfo.papersetid }).then(resp => {
          setPaperSetDeleteMessage('删除成功');
          // jumpToPaperSetList();
        }).catch(handleError)
      }} >
        删除论文库
      </button>;
    }
    return <></>;
  }

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
    <AddPaperButton />
    <DeletePaperSetButton />
  </>;
}

export default function PresentPaperSetDetail({ paperSetInfo, jumpPaperPage, setOnPage, jumpToPaperSetList }: Props) {
  const [message, setMessage] = useState<string | null>(null);
  const [paperSetDeleteMessage, setPaperSetDeleteMessage] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [reload, setReload] = useState(false);

  const getUserId = async () => {
    await axios.get('/api/userid').then(resp => {
        setUserId(resp.data.data.userid);
    }).catch(err => { console.error(err) })
  };
  useEffect(() => { getUserId() }, []);

  function Alerts() {
    if (message === null)
      return <></>;
    return <div className="alert alert-success" role="alert" style={{ display: 'true' }}>
      {message}
    </div>;
  }

  function OthersHijackButton({className, item, index}: HijackButtonProps) {
    // used when userid != me
    return <button className={className} disabled={index === 0} onClick={() => {jumpPaperPage(item)}}>
      {index === 0 ? "" : "更多"}
    </button>;
  }

  function MyHijackButton({className, item, index}: HijackButtonProps) {
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
        setMessage('删除成功');
        setReload(!reload);
      }).catch(err => {
        console.error('error', err);
        setMessage(`删除失败： ${err.response.data.status}: ${err.response.data.error}`);
        setReload(!reload);
      })
    }

    if (index === 0)
      return <button className={className} disabled={true} />

    return <div className="btn-group">
      <button type="button" className={"btn btn-outline-primary dropdown-toggle "} data-bs-toggle="dropdown" aria-expanded="false">
        更多
      </button>
      <ul className="dropdown-menu">
        <li><button className="dropdown-item btn btn-success" onClick={() => { jumpPaperPage(item) }}>论文详情</button></li>
        <li><button className="dropdown-item btn btn-danger" onClick={() => { handleClickDelete() }}>删除</button></li>
      </ul>
    </div>;
  }

  function PaperSetPapers() {
    return <ReloadContext.Provider value={reload}>
      <PaperListPage
        hijackSetSearchParam={(param) => { return {...param, papersetid: paperSetInfo.papersetid} }}
        HijackButton={userId === paperSetInfo.userid ? MyHijackButton : OthersHijackButton}
      />
    </ReloadContext.Provider>;
  }

  function CommentSection() {
    if (paperSetInfo.can_comment || paperSetInfo.userid === userId)
      // make it comment
      return <PaperSetReview paperSetInfo={paperSetInfo} />;
    return <></>;
  }

  function LivingPage() {
    return <>
      <Description paperSetInfo={paperSetInfo} setOnPage={setOnPage} userId={userId} setPaperSetDeleteMessage={setPaperSetDeleteMessage} />
      <Alerts />
      <PaperSetPapers />
      <CommentSection />
    </>;
  }

  function DeadPage() {
    return <>
      <p>{paperSetDeleteMessage}</p>
      <button className="btn btn-success" onClick={() => jumpToPaperSetList()} >返回论文库列表</button>
    </>
  }

  return <>
    <h1>{paperSetInfo.name}</h1>
    {paperSetDeleteMessage === null ? <LivingPage /> : <DeadPage />}
  </>;
}
