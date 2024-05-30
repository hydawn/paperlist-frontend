import axios from 'axios';
import { ChangeEvent, useState, useRef, FormEvent } from 'react';
import DynamicAuthorsInput from './AuthorsInput';

interface Props {
  setPage: Function
}

function handleFileChange(event: ChangeEvent<HTMLInputElement>, setFile: Function) {
  if (!event.target.files || event.target.files.length <= 0) {
    return;
  }
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = async () => {
   if (reader.result && typeof reader.result === 'string') {
      console.log('got it, now setting file string');
      console.log('wake up');
      const base64 = reader.result.split(',')[1];
      setFile(base64, file.type, file.name);
    }
  };
  reader.readAsDataURL(file);
}

async function postInsertion(payload: object, onSuccess: Function) {
  console.log('got payload trying to post insert');
  axios.post(
    '/api/insert_paper',
    payload
  ).then(resp => {
    console.log('success, got resp:', resp);
    onSuccess();
  }).catch(resp => {
    console.error('error inserting paper:', resp);
  });
}

export default function AddPaper({ setPage }: Props) {
  const titleRef = useRef<HTMLInputElement>(null);
  const journalRef = useRef<HTMLInputElement>(null);
  const abstractRef = useRef<HTMLTextAreaElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);
  const [authors, setAuthors] = useState<string[]>(['']);
  const [pubdate, setPubdate] = useState<string | null>(null);

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

  console.log('rerender with form', paperForm);

  function setFile(inputString: string, file_type: string, file_name: string) {
    console.log(`getting ${file_name} of type`, file_type);
    setFileName(file_name);
    setFileContent(inputString);
  }

  function checkDate(gotDate: string, setWasInvalid: Function) {
    const regex = /[12][0-9]{3}-[01][0-9]-[0-3][0-9]/;
    console.log('got:', gotDate);
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
    if (!checkDate(paperForm.publication_date, (_: boolean) => {})) {
      return false;
    }
    return true;
  }

  async function submitInsertion(event: FormEvent) {
    event.preventDefault();
    if (!checkPaloadGood()) {
      // alert('bad payload');
      return;
    }
    if (!titleRef.current?.value)
      return;
    paperForm.title = titleRef.current.value;
    if (!abstractRef.current?.value)
      return;
    paperForm.abstract = abstractRef.current.value;
    if (!journalRef.current?.value)
      return;
    paperForm.journal = journalRef.current.value;
    if (fileName === null)
      return;
    paperForm.file_name = fileName;
    if (fileContent === null)
      return;
    paperForm.file_content = fileContent;
    paperForm.authors = authors;
    if (pubdate === null)
      return;
    paperForm.publication_date = pubdate;
    console.log(paperForm)
    await postInsertion(paperForm, () => { setPage('添加论文') });
  }

  function PublicationDateInput() {
    const [wasInvalid, setWasInvalid] = useState<boolean>(false);
    console.log('this is rendered: ' + (paperForm.publication_date || "no date at all"));
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
      console.log('file name is null');
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

  return (<>
    <h2>添加论文</h2>
    <form className="mt-3 mx-5" onSubmit={submitInsertion}>
      <div className="mb-3">
        <label htmlFor="inputName" className="form-label">论文标题</label>
        <input type="text" className="form-control" id="inputName" aria-describedby="nameHelp" ref={titleRef} />
      </div>
      <FileInput />
      <div className="mb-3">
        <label htmlFor="inputDescription" className="form-label">摘要</label>
        <textarea className="form-control" id="inputDescription" ref={abstractRef} />
      </div>
      <PublicationDateInput />
      <div className="mb-3">
        <label htmlFor="inputJournal" className="form-label">发表刊物</label>
        <input type="text" className="form-control" id="inputJournal" ref={journalRef} />
      </div>
      <div className="mb-3">
        <label htmlFor="inputCitations" className="form-label">总引用数</label>
        <input type="number" min="0" defaultValue="0" className="form-control" id="inputCitations" onBlur={event => {paperForm.total_citations = parseInt(event.target.value, 10)}} />
      </div>
      <DynamicAuthorsInput authors={authors} setAuthors={setAuthors} />
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="checkPrivate" onClick={() => { console.log('checked'); paperForm.private = true; }} />
        <label className="form-check-label" htmlFor="checkPrivate">私密</label>
      </div>
      <button className="btn btn-primary" type="submit">提交</button>
    </form>
  </>);
}
