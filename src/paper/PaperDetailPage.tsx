import { useState, useEffect } from "react";
import axios from "axios";
import {PaperInfo} from "./Types";
import LoadingPage from "../LoadingPage";
import PaperReview from "./PaperReview";

interface Props {
  inputPaperInfo: PaperInfo
}

async function getPaperDetail(paperId: string, setPaperInfo: Function) {
  await axios.get('/api/paper_detail', { params: { paperid: paperId } }).then(resp => { setPaperInfo(resp.data.data as PaperInfo) }).catch(resp => {console.error('got error', resp)})
}

async function getPaperContent(paperId: string, setPaperInfo: Function) {
  await axios.get('/api/paper_content', { params: { paperid: paperId } }).then(resp => { setPaperInfo(resp.data.data as PaperInfo) }).catch(resp => {console.error('got error', resp)})
}

interface PresentPaperDetailProps {
  paperInfo: PaperInfo
}

function PresentPaperDetail({paperInfo}: PresentPaperDetailProps) {
  function Abstract() {
    return <><div className="input-group mb-3">
      <span className="input-group-text">摘要</span>
      <input type="text" className="form-control" value={paperInfo.abstract} readOnly disabled />
      <button
        className="input-group-text btn btn-primary"
        data-bs-toggle="collapse" data-bs-target="#collapseExample"
        aria-expanded="false" aria-controls="collapseExample">
        更多
      </button>
    </div>
    <div className="collapse mb-3" id="collapseExample">
      <div className="card card-body">
        {paperInfo.abstract}
      </div>
    </div></>;
  }

  function Authors() {
    return <div className="input-group mb-3">
      <span className="input-group-text">作者</span>
      <input type="text" className="form-control" value={paperInfo.authors?.map((name, index) => name)} readOnly disabled />
    </div>;
  }

  function OtherInfo() {
    return <div className="input-group mb-3">
      <span className="input-group-text">发表期刊</span>
      <input type="text" className="form-control" value={paperInfo.journal} readOnly disabled />
      <span className="input-group-text">发表于</span>
      <input type="text" className="form-control" value={paperInfo.publication_date} readOnly disabled />
      <span className="input-group-text">总引用</span>
      <input type="text" className="form-control" value={paperInfo.total_citations} readOnly disabled />
      <button className="input-group-text btn btn-primary">文件预览</button>
      <button className="input-group-text btn btn-success">文件下载</button>
    </div>;
  }

  return <>
    <h1>{paperInfo.title}</h1>
    <Authors />
    <OtherInfo />
    <Abstract />
  </>;
}

export default function PaperDetailPage({inputPaperInfo}: Props) {
  const [paperInfo, setPaperInfo] = useState<PaperInfo | null>(null);

  useEffect(() => { setPaperInfo(inputPaperInfo) }, []);

  if (paperInfo === null)
    return <LoadingPage />;
  return <>
    <PresentPaperDetail paperInfo={paperInfo} />
    <PaperReview paperInfo={paperInfo} />
  </>;
}
