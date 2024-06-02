import {PaperInfo} from "../Types";
import {useEffect, useState} from 'react';
import AddPaper from "../userhome/AddPaper";
import axios from 'axios';

interface Props {
  paperInfo: PaperInfo
  className: string
  reloadPaperInfo: Function
  jumpToPaperList: Function
}

interface ModifyPaperInfoInActionProps {
  paperInfo: PaperInfo
  reloadPaperInfo: Function
}

function ModifyPaperInfoInAction({ paperInfo, reloadPaperInfo }: ModifyPaperInfoInActionProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [returnPaperInfo, setReturnPaperInfo] = useState<PaperInfo | null>(null);
  async function clearMessage() {
    if (message === null)
      return;
    // reload background
    await new Promise(resolve => setTimeout(resolve, 700));
    setMessage(null);
    // reloadPaperInfo(null);
    if (returnPaperInfo === null)
      return;
    console.log(`with citations ${returnPaperInfo?.total_citations}`)
    reloadPaperInfo(returnPaperInfo);
    setReturnPaperInfo(null);
  }
  function hijackPost(form: object, _: Function, __: Function) {
    // submit form to change paper info
    axios.post('/api/modify_paper', {...form, paperid: paperInfo.paperid} ).then(resp => {
      setMessage('修改成功');
      setReturnPaperInfo(resp.data.data as PaperInfo);
    }).catch(err => {
      console.error('got error', err)
    });
  }
  return <>
    <div className="modal-header">
      <div className="input-group">
        <h1 className="modal-title fs-5" id="modifyPaperModalLabel">修改论文</h1>
      </div>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearMessage}></button>
    </div>
    <div className="modal-body">
      { message ? <p>{message}</p> : <><AddPaper paperInfo={paperInfo} hijackPost={hijackPost} /></> }
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearMessage}>关闭</button>
    </div>
  </>;
}

export function ModifyPaperInfoButton({paperInfo, className, reloadPaperInfo, jumpToPaperList}: Props) {
  const [userId, setUserId] = useState<string | null>(null);
  async function getUserId() {
    await axios.get('/api/userid').then(resp => {
      setUserId(resp.data.data.userid);
    }).catch(err => {
      console.error('got error', err)
    });
  }
  useEffect(() => { getUserId() }, []);

  function DeletePaperButton() {
    return <button className={className + " btn btn-danger"} onClick={async () => {
      await axios.post('/api/delete_paper', {paperid: paperInfo.paperid}).then((_) => {
        jumpToPaperList();
      }).catch(err => {
        console.error('got error', err)
      });
    }} >删除论文</button>
  }

  if (userId === paperInfo.userid) {
    return <><div className="modal fade" id="modifyPaperModal" tabIndex={-1} aria-labelledby="modifyPaperModal" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
          <ModifyPaperInfoInAction paperInfo={paperInfo} reloadPaperInfo={reloadPaperInfo} />
          </div>
        </div>
      </div>
      <button className={className + " btn btn-outline-info"} data-bs-toggle="modal" data-bs-target="#modifyPaperModal">修改论文</button>
      <DeletePaperButton />
    </>;
  }
  return <></>;
}
