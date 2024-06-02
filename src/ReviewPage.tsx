import {Comment} from "./Types";
import LoadingPage from "./LoadingPage";
import {useState, useEffect} from "react";

import {AxiosResponse} from "axios";
import SimplePager from "./SimplePager";

export function handleError(resp: AxiosResponse) {
  console.error('got error', resp);
  return resp;
}

interface Props {
  getFromWeb: Function
  pushToWeb: Function
}

export function ReviewSection({getFromWeb, pushToWeb}: Props) {
  const [review, setReview] = useState<number | null>(null);

  function getReview() {
    getFromWeb((resp: AxiosResponse) => setReview(resp.data.data.review));
  }

  useEffect(() => { getReview() }, []);

  function ShowReview() {
    if (review === null)
      return <LoadingPage />
    return <h5>用户评分: <span className="badge text-bg-secondary">{review}</span></h5>
  }

  function AddReview() {
    const [rev, setRev] = useState(5);
    // async function handleAddReview() {  }
    return <>
      <div className="input-group">
        <span className="input-group-text">添加评分</span>
        <input type="text" className="form-control" id="revViewer" value={rev} readOnly disabled />
        <button className="input-group-text btn btn-outline-primary" onClick={() => pushToWeb(rev, getReview)}>发布</button>
      </div>
      <input
        type="range"
        className="form-range" defaultValue={rev}
        min="1" max="10" id="reviewRange"
        onChange={(event) => {setRev(parseInt(event.target.value))}}
      />
    </>;
  }

  return <>
    <ShowReview />
    <AddReview />
  </>;
}

export function CommentSection({getFromWeb, pushToWeb}: Props) {
  const [commentList, setCommentList] = useState<Array<Comment> | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPage, setTotalPage] = useState<number | null>(null);

  async function getComment(page: number = 1, per_page: number = 3) {
    getFromWeb(page, per_page, (resp: AxiosResponse) => {
      setCommentList(resp.data.data.comment_list as Array<Comment>);
      setTotalPage(resp.data.data.total_page);
      setCurrentPage(resp.data.data.current_page);
    })
  }

  useEffect(() => { getComment(1, 3) }, []);

  function ShowComment() {
    if (commentList === null)
      return <LoadingPage />
    return <>
      {commentList.map((comment, index) => (
        <div key={"showcomment-" + index} className="card mb-3">
          <div className="card-header">
            {comment.username}
          </div>
          <div className="card-body">
            <h5 className="card-title">{comment.comment}</h5>
            <p className="card-text">
              : {comment.commented_on.split('.')[0].replace('T', ' ')}
            </p>
          </div>
        </div>
      ))}
    </>;
  }

  function AddComment() {
    const [com, setCom] = useState<string | null>(null);
    return <div className="input-group mb-3">
      <span className="input-group-text">评论</span>
      <textarea className="form-control" id="inputDescription" value={com || ''} onChange={(event) => {setCom(event.target.value)}} />
      <button className="input-group-text btn btn-outline-primary" onClick={() => { pushToWeb(com, getComment) }}>发布</button>
    </div>;
  }

  return <>
    <h3>评论区</h3>
    <ShowComment />
    <AddComment />
    { currentPage && totalPage && <SimplePager currentPage={currentPage} totalPage={totalPage} loadPage={(page: number) => {getComment(page)}} />}
  </>;
}
