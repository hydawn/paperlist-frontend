import axios from 'axios';
import { useRef, FormEvent } from 'react';

async function postInsertion(payload: object, onSuccess: Function) {
  console.log('got payload trying to post insert');
  axios.post(
    '/api/insert_paperset',
    payload
  ).then(resp => {
    console.log('success, got resp:', resp);
    onSuccess(resp);
  }).catch(resp => {
    console.error('error inserting paper:', resp);
  });
}

export default function AddPaperSet() {
  const nameRef = useRef<HTMLInputElement>(null);
  const descriptionRef = useRef<HTMLTextAreaElement>(null);

  var paperSetForm = {
    name: '',
    description: '',
    private: false,
  }

  async function submitInsertion(event: FormEvent) {
    event.preventDefault();
    if (!nameRef.current?.value) {
      console.log('name ref bad');
      return;
    }
    paperSetForm.name = nameRef.current.value;
    if (!descriptionRef.current?.value) {
      console.log('description bad');
      return;
    }
    paperSetForm.description = descriptionRef.current.value;
    console.log(paperSetForm)
    await postInsertion(paperSetForm, () => { });
  }

  return (<>
    <h2>添加论文库</h2>
    <form className="mt-3 mx-5" onSubmit={submitInsertion}>
      <div className="mb-3">
        <label htmlFor="inputName" className="form-label">论文库名</label>
        <input type="text" className="form-control" id="inputName" aria-describedby="nameHelp" ref={nameRef} />
      </div>
      <div className="mb-3">
        <label htmlFor="inputDescription" className="form-label">描述</label>
        <textarea className="form-control" id="inputDescription" ref={descriptionRef} />
      </div>
      <div className="form-check">
        <input className="form-check-input" type="checkbox" id="checkPrivate" onClick={() => { console.log('checked'); paperSetForm.private = true; }} />
        <label className="form-check-label" htmlFor="checkPrivate">私密</label>
      </div>
      <button className="btn btn-primary" type="submit">提交</button>
    </form>
  </>);
}
