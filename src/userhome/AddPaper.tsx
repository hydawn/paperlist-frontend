import axios from 'axios';
import { ChangeEvent, useState, FormEvent } from 'react';
import DynamicAuthorsInput from './AuthorsInput';
import {PaperInfo} from '../Types';

function handleFileChange(event: ChangeEvent<HTMLInputElement>, setFile: Function) {
  if (!event.target.files || event.target.files.length <= 0) {
    return;
  }
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async () => {
   if (reader.result && typeof reader.result === 'string') {
      const base64 = reader.result.split(',')[1];
      setFile(base64, file.type, file.name);
    }
  };
  reader.readAsDataURL(file);
}

async function postInsertion(payload: object, onSuccess: Function) {
  axios.post(
    '/api/insert_paper',
    payload
  ).then(resp => {
    console.log('insert_paper got resp:', resp);
    onSuccess(resp);
  }).catch(resp => {
    console.error('error inserting paper:', resp);
  });
}

interface Props {
  paperInfo: PaperInfo | null
  hijackPost: (payload: object, onSuccess: Function, actualInsertion: Function) => void
}

export const noHijack = (form: object, onSuccess: Function, postFunc: Function) => postFunc(form, onSuccess);

export default function AddPaper({paperInfo, hijackPost}: Props) {
  // const titleRef = useRef<HTMLInputElement>(null);
  // const journalRef = useRef<HTMLInputElement>(null);
  // const abstractRef = useRef<HTMLTextAreaElement>(null);
  const citeValue = () => {
    if (paperInfo === null)
      return null;
    if (typeof paperInfo.total_citations === 'string')
      return parseInt(paperInfo.total_citations);
    return paperInfo.total_citations;
  };
  const [title, setTitle] = useState<string | null>(paperInfo?.title || null);
  const [journal, setJournal] = useState<string | null>(paperInfo?.journal || null);
  const [abstract, setAbstract] = useState<string | null>(paperInfo?.abstract || null);
  const [citations, setCitations] = useState<number | null>(citeValue());
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [authors, setAuthors] = useState<string[]>(paperInfo?.authors || ['']);
  const [pubdate, setPubdate] = useState<string | null>(paperInfo?.publication_date || null);
  const [isPrivate, setIsPrivate] = useState<boolean>(paperInfo?.is_private || false);
  const [message, setMessage] = useState<string | null>(null);

  function clearAll() {
    setTitle(null);
    setJournal(null);
    setAbstract(null);
    setCitations(0);
    setFileName(null);
    setFileContent(null);
    setAuthors(['']);
    setPubdate(null);
    setIsPrivate(false);
    setMessage(null);
  }

  var paperForm = {
    title: '',
    abstract: '',
    file_name: '',
    file_content: '',
    private: false,
    publication_date: '',
    journal: '',
    total_citations: 0,
    authors: [''],
  }

  function setFile(inputString: string, _: string, file_name: string) {
    setFileName(file_name);
    setFileContent(inputString);
  }

  function checkDate(gotDate: string, setWasInvalid: Function) {
    const regex = /[12][0-9]{3}-[01][0-9]-[0-3][0-9]/;
    if (!gotDate.match(regex)) {
      setWasInvalid(true);
      // alert(`date: [${gotDate}] does not match [${regex}]`);
      return false;
    }
    setWasInvalid(false);
    setPubdate(gotDate);
    return true;
  }

  function checkPaloadGood() {
    if (!checkDate(pubdate || '', (_: boolean) => {})) {
      alert('check date failed, will not submit')
      return false;
    }
    return true;
  }

  async function submitInsertion(event: FormEvent) {
    event.preventDefault();
    if (!checkPaloadGood()) {
      alert('bad payload');
      return;
    }
    if (title === null) {
      alert('title ref bad');
      return;
    }
    paperForm.title = title;
    if (abstract === null) {
      alert('abstract bad');
      return;
    }
    paperForm.abstract = abstract;
    if (journal === null) {
      alert('journal bad');
      return;
    }
    paperForm.journal = journal;
    if (paperInfo === null) {
      if (fileName === null) {
        alert('file name is null');
        return;
      }
      paperForm.file_name = fileName;
      if (fileContent === null) {
        alert('file content is null');
        return;
      }
      paperForm.file_content = fileContent;
    } else {
      paperForm.file_name = (fileName || '');
      paperForm.file_content = (fileContent || '');
    }
    paperForm.authors = authors;
    if (pubdate === null) {
      alert('pubdate is null');
      return;
    }
    paperForm.publication_date = pubdate;
    if (citations === null) {
      alert('citations is null');
      return;
    }
    paperForm.total_citations = citations;
    paperForm.private = isPrivate;
    console.log('submitting ', paperForm);
    hijackPost(paperForm, () => {
      setMessage('添加成功');
    }, postInsertion);
  }

  function PublicationDateInput() {
    const [wasInvalid, setWasInvalid] = useState<boolean>(false);
    return <div className="mb-3">
      <label htmlFor="inputDate" className="form-label">发表日期</label>
      <div className="form-floating">
        <input type="text"
          className={"form-control" + (wasInvalid ? " is-invalid" : "")}
          id="inputDate"
          defaultValue={pubdate || ''}
          // onChange={(event) => {setInputDate(event.target.value)}}
          onBlur={(event) => {checkDate(event.target.value, setWasInvalid)}}
        />
        {wasInvalid ? <label htmlFor="inputDate">格式错误</label> : <label htmlFor="inputDate">YYYY-MM-DD</label>}
      </div>
    </div>;
  }

  function FileInput() {
    if (fileName === null) {
      return <div className="mb-3">
        <label htmlFor="inputFile" className="form-label">论文pdf</label>
        <input
          type="file"
          className="form-control"
          id="inputFile"
          onChange={event => { handleFileChange(event, setFile) }}
        />
      </div>;
    }
    return <div className="mb-3">
      <label htmlFor="inputFile" className="form-label">论文pdf</label>
      <div className="input-group mb-3">
        <button
          className="btn btn-danger"
          onClick={() => {
            setFileName(null);
            setFileContent(null);
          }}>清除文件</button>
        <input
          type="text" className="form-control"
          id="inputFile" value={fileName} aria-label="Disabled input" disabled
          readOnly />
      </div>
    </div>;
  }

  function Header() {
    return <h2>添加论文</h2>
  }

  function Body() {
    if (message != null)
      return <><p>{message}</p><button className="btn btn-success" onClick={clearAll}>继续添加</button></>;
    return <>
      <form className="mt-3 mx-5" onSubmit={submitInsertion}>
        <div className="mb-3">
          <label htmlFor="inputName" className="form-label">论文标题</label>
          <input type="text" className="form-control" id="inputName" aria-describedby="nameHelp" defaultValue={title || ''} onBlur={(event) => setTitle(event.target.value)} />
        </div>
        <FileInput />
        <div className="mb-3">
          <label htmlFor="inputDescription" className="form-label">摘要</label>
          <textarea className="form-control" id="inputDescription" defaultValue={abstract || ''} onBlur={(event) => setAbstract(event.target?.value)} />
        </div>
        <PublicationDateInput />
        <div className="mb-3">
          <label htmlFor="inputJournal" className="form-label">发表刊物</label>
          <input type="text" className="form-control" id="inputJournal" defaultValue={journal || ''} onBlur={(event) => setJournal(event.target?.value)} />
        </div>
        <div className="mb-3">
          <label htmlFor="inputCitations" className="form-label">总引用数</label>
          <input type="number" min="0" className="form-control" id="inputCitations" defaultValue={citations || "0"} onBlur={(event) => {console.log('got citations', event.target.value); setCitations(parseInt(event.target.value, 10))}} />
        </div>
        <DynamicAuthorsInput authors={authors} setAuthors={setAuthors} />
        <div className="form-check">
          <input className="form-check-input" type="checkbox" id="checkPrivate" defaultChecked={isPrivate} onChange={() => setIsPrivate(!isPrivate) } />
          <label className="form-check-label" htmlFor="checkPrivate">私密</label>
        </div>
        <button className="btn btn-primary" type="submit">提交</button>
      </form>
    </>
  }

  return (<>
    <Header />
    <Body />
  </>);
}
