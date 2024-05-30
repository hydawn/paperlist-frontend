import { useState, useEffect } from "react";
import axios from "axios";
import './PaperPage.css'
import PaperPageSearchBar from "./PaperPageSearchBar";
import { PaperInfo } from './Types.tsx';

interface Params {
  [key: string]: string | number | boolean;
}

async function getPapers(setPaperInfoList: Function, params: Params) {
  await axios.get('/api/search_paper', { params: params }).then(resp => {
    setPaperInfoList(resp.data.data.data_list as Array<PaperInfo>);
  }).catch(resp => { console.error('got error', resp) })
}

interface PresentPaperProps {
  paperInfo: PaperInfo,
  index: number
}

function PresentPaper({paperInfo, index}: PresentPaperProps) {
  // <span className="input-group-text"><b>{paperInfo.title}</b></span>
  return <div className="input-group mb-3">
    <input type="text" aria-label="Paper Title" value={paperInfo.title} readOnly className="form-control paper-title" />
    <input type="text" aria-label="Journal" value={paperInfo.journal} readOnly className="form-control paper-journal" />
    <input type="text" aria-label="Pub Date" value={paperInfo.publication_date} readOnly className="form-control paper-publication-date" />
    <input type="text" aria-label="Citations" value={paperInfo.total_citations} readOnly className="form-control paper-citations" />
    <button className="form-control paper-more" disabled={index === 0} onClick={() => {}}>{index === 0 ? "" : "更多"}</button>
  </div>;
}

export default function PaperPage() {
  const [paperInfoList, setPaperInfoList] = useState<Array<PaperInfo> | null>(null);

  useEffect(() => {getPapers(setPaperInfoList, {page: 1, per_page: 10, title: ''})}, []);

  interface PresentPapersProps {
    paperInfoList: Array<PaperInfo>
  }

  function PresentPapers({paperInfoList}: PresentPapersProps) {
    const header: PaperInfo = {
      paperid: '',
      userid: '',
      username: '',
      title: '题目',
      abstract: '',
      file_name: '',
      file_content: '',
      publication_date: '发表日期',
      journal: '发表期刊',
      total_citations: '引用数',
      is_private: false,
    }
    return <div>
      <PresentPaper paperInfo={header} index={0} />
      {paperInfoList.map((paperInfo, index) => (
        <PresentPaper paperInfo={paperInfo} index={index + 1} />
      ))}
    </div>;
  }

  return <>
    <h1>论文</h1>
    <PaperPageSearchBar setPaperInfoList={setPaperInfoList} />
    {paperInfoList && <PresentPapers paperInfoList={paperInfoList} />}
  </>;
}
