import { useState, useEffect } from "react";
import axios from "axios";
import {PaperInfo} from "../Types";
import LoadingPage from "../LoadingPage";
import PaperReview from "./PaperReview";
import PaperPreview from "./PaperPreview";

interface Props {
  inputPaperInfo: PaperInfo
}

async function handleFileDownload(paperId: string) {
  await axios.get('/api/paper_content', { params: { paperid: paperId }}).then(resp => {
    const { file_name, file_content } = resp.data.data;

    // Convert base64 to Blob
    const byteCharacters = atob(file_content);
    const byteNumbers = new Array(byteCharacters.length).fill(0).map((_, i) => byteCharacters.charCodeAt(i));
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray]);

    // Create a download link
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file_name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

  }).catch(resp => { console.error(resp); });
}

interface PresentPaperDetailProps {
  paperInfo: PaperInfo,
  previewActive: boolean,
  setPreviewActive: Function,
}

function PresentPaperDetail({paperInfo, previewActive, setPreviewActive}: PresentPaperDetailProps) {
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
      <input type="text" className="form-control" value={paperInfo.authors?.map((name) => name)} readOnly disabled />
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
      <button
        className={"input-group-text btn " + (previewActive ? " btn-danger" : " btn-primary")}
        onClick={() => { setPreviewActive(!previewActive) }}
      >
      {previewActive ? '关闭' : '文件'}预览
      </button>
      <button className="input-group-text btn btn-success" onClick={() => { handleFileDownload(paperInfo.paperid) }}>文件下载</button>
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
  const [previewActive, setPreviewActive] = useState(false);

  useEffect(() => { setPaperInfo(inputPaperInfo) }, []);

  if (paperInfo === null)
    return <LoadingPage />;
  return <>
    <PresentPaperDetail paperInfo={paperInfo} previewActive={previewActive} setPreviewActive={setPreviewActive} />
    { previewActive && <PaperPreview paperInfo={paperInfo} /> }
    <PaperReview paperInfo={paperInfo} />
  </>;
}
