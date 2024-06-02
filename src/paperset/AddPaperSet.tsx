import axios from 'axios';
import { useState, FormEvent } from 'react';

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
  const [message, setMessage] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [canModify, setCanModify] = useState<boolean>(false);
  const [canComment, setCanComment] = useState<boolean>(true);
  var paperSetForm = {
    name: '',
    description: '',
    private: false,
    can_modify: false,
    can_comment: false,
  }
  var checkerMaps = [
    {name: '私密', getter: isPrivate, setter: setIsPrivate, defaultValue: false},
    {name: '其他人可修改', getter: canModify, setter: setCanModify, defaultValue: false},
    {name: '其他人可评论', getter: canComment, setter: setCanComment, defaultValue: true},
  ];

  const clearAll = () => {
    checkerMaps.map(item => item.setter(item.defaultValue));
    setName(null);
    setDescription(null);
    setMessage(null);
  }

  async function submitInsertion(event: FormEvent) {
    event.preventDefault();
    if (name === null) {
      alert('name cannot be empty');
      return;
    }
    paperSetForm.name = name;
    if (description != null)
      paperSetForm.description = description;
    paperSetForm.can_modify = canModify
    paperSetForm.can_comment = canComment
    paperSetForm.private = isPrivate
    console.log(paperSetForm)
    await postInsertion(paperSetForm, () => {
      setMessage('新建成功');
    });
  }

  function SubmitForm() {
    if (message != null)
      return <>
        <p>{message}</p>
        <button className="btn btn-success" onClick={() => clearAll()} >继续添加</button>
      </>
    return <form className="mt-3 mx-5" onSubmit={submitInsertion}>
      <div className="mb-3">
        <label htmlFor="inputName" className="form-label">论文库名</label>
        <input type="text" className="form-control" id="inputName" aria-describedby="nameHelp" defaultValue={name || ''} onBlur={(event) => { event.target.value != '' && setName(event.target.value) }} />
      </div>
      <div className="mb-3">
        <label htmlFor="inputDescription" className="form-label">描述</label>
        <textarea className="form-control" id="inputDescription" defaultValue={description || ''} onBlur={(event) => { event.target.value != '' && setDescription(event.target.value) }} />
      </div>
      {
        checkerMaps.map((item, index) => (
      <div key={"addpaperset-checker-" + index} className="form-check">
        <input className="form-check-input" type="checkbox" id="checkPrivate" defaultChecked={item.getter} onChange={() => item.setter(!item.getter)} />
        <label className="form-check-label" htmlFor="checkPrivate">{item.name}</label>
      </div>
        ))
      }
      <button className="btn btn-primary" type="submit">提交</button>
    </form>;
  }

  return (<>
    <h2>添加论文库</h2>
    <SubmitForm />
  </>);
}
