import { useState, useEffect } from "react";
import PaperPageSearchBar from "./PaperPageSearchBar.tsx";
import { PaperInfo } from './Types.tsx';

import axios from "axios";

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
  index: number,
  setPaperId: Function
}

function PresentPaper({paperInfo, index, setPaperId}: PresentPaperProps) {
  return <div className="input-group mb-3">
    <input type="text" aria-label="Paper Title" value={paperInfo.title} readOnly className="form-control paper-title" />
    <input type="text" aria-label="Journal" value={paperInfo.journal} readOnly className="form-control paper-journal" />
    <input type="text" aria-label="Pub Date" value={paperInfo.publication_date} readOnly className="form-control paper-publication-date" />
    <input type="text" aria-label="Citations" value={paperInfo.total_citations} readOnly className="form-control paper-citations" />
    <button className="form-control paper-more" disabled={index === 0} onClick={() => { setPaperId(paperInfo.paperid) }}>{index === 0 ? "" : "更多"}</button>
  </div>;
}

interface Props {
  setPaperId: Function
}

export default function PaperListPage({setPaperId}: Props) {
  const [paperInfoList, setPaperInfoList] = useState<Array<PaperInfo> | null>(null);

  useEffect(() => {getPapers(setPaperInfoList, {page: 1, per_page: 10, title: ''})}, []);

  function PresentPapers() {
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
      <PresentPaper paperInfo={header} index={0} setPaperId={setPaperId} />
      {paperInfoList && paperInfoList.map((paperInfo, index) => (
        <PresentPaper paperInfo={paperInfo} index={index + 1} setPaperId={setPaperId} />
      ))}
    </div>;
  }

  return <>
    <h1>论文列表</h1>
    <PaperPageSearchBar setPaperInfoList={setPaperInfoList} />
    <PresentPapers />
  </>;
}
