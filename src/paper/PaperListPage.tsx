import { useState, useEffect } from "react";
import PaperPageSearchBar from "./PaperPageSearchBar.tsx";
import { PaperInfo, SearchPaperParam } from './Types.tsx';

import axios from "axios";

async function getPapers(setPaperInfoList: Function, params: SearchPaperParam) {
  await axios.get('/api/search_paper', { params: params }).then(resp => {
    setPaperInfoList(resp.data.data.data_list as Array<PaperInfo>);
    console.log(resp.data.data.data_list[0].authors)
  }).catch(resp => { console.error('got error', resp) })
}

interface PresentPaperProps {
  paperInfo: PaperInfo,
  index: number,
  setPaperInfo: Function
}

function PresentPaper({paperInfo, index, setPaperInfo}: PresentPaperProps) {
  return <div className="input-group mb-3">
    <input type="text" aria-label="Paper Title" value={paperInfo.title} readOnly className="form-control paper-title" />
    <input type="text" aria-label="Journal" value={paperInfo.journal} readOnly className="form-control paper-journal" />
    <input type="text" aria-label="Pub Date" value={paperInfo.publication_date} readOnly className="form-control paper-publication-date" />
    <input type="text" aria-label="Citations" value={paperInfo.total_citations} readOnly className="form-control paper-citations" />
    <button className="form-control paper-more" disabled={index === 0} onClick={() => { setPaperInfo(paperInfo) }}>{index === 0 ? "" : "更多"}</button>
  </div>;
}

interface Props {
  setPaperInfo: Function
}

export default function PaperListPage({setPaperInfo}: Props) {
  const [paperInfoList, setPaperInfoList] = useState<Array<PaperInfo> | null>(null);
  const [searchParam, setSearchParam] = useState<SearchPaperParam>({page: 1, per_page: 10, title: '', uploader: '', journal: '', regex: false});

  useEffect(() => {getPapers(setPaperInfoList, searchParam)}, []);

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
      authors: [],
    }
    return <div>
      <PresentPaper paperInfo={header} index={0} setPaperInfo={setPaperInfo} />
      {paperInfoList && paperInfoList.map((paperInfo, index) => (
        <PresentPaper paperInfo={paperInfo} index={index + 1} setPaperInfo={setPaperInfo} />
      ))}
    </div>;
  }

  return <>
    <h1>论文列表</h1>
    <PaperPageSearchBar setSearchParam={(params: SearchPaperParam) => {setSearchParam(params); getPapers(setPaperInfoList, params)}} />
    <PresentPapers />
  </>;
}
