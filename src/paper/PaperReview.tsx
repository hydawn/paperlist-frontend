import {PaperInfo, Comment} from "../Types";
import LoadingPage from "../LoadingPage";
import {useState, useEffect} from "react";

import axios, {AxiosResponse} from "axios";
import SimplePager from "../SimplePager";

interface Props {
  paperInfo: PaperInfo
}

function handleError(resp: AxiosResponse) {
  console.error('got error', resp);
  return resp;
}

export default function PaperReview({paperInfo}: Props) {
  const [review, setReview] = useState<number | null>(null);
  const [commentList, setCommentList] = useState<Array<Comment> | null>(null);
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [totalPage, setTotalPage] = useState<number | null>(null);

  async function getReview() {
    await axios.get(
      '/api/get_paper_review',
      {params:{ paperid: paperInfo.paperid }}
    ).then(resp => {
      setReview(resp.data.data.review);
    }).catch(handleError);
  }

  async function getComment(page: number = 1, per_page: number = 3) {
    await axios.get(
      '/api/search_paper_comment',
      {params:{ paperid: paperInfo.paperid, page: page, per_page: per_page }}
    ).then(resp => {
      setCommentList(resp.data.data.comment_list as Array<Comment>);
      setTotalPage(resp.data.data.total_page);
      setCurrentPage(resp.data.data.current_page);
    }).catch(handleError);
  }

  function ShowReview() {
    if (review === null)
      return <LoadingPage />
    return <h5>用户评分: <span className="badge text-bg-secondary">{review}</span></h5>
  }

  function AddReview() {
    const [rev, setRev] = useState(5);
    async function handleAddReview() {
      await axios.post('/api/review_paper', {paperid: paperInfo.paperid, star: rev}).then((_) => { getReview() }).catch(handleError);
    }
    return <>
      <div className="input-group">
        <span className="input-group-text">添加评分</span>
        <input type="text" className="form-control" id="revViewer" value={rev} readOnly disabled />
        <button className="input-group-text btn btn-outline-primary" onClick={handleAddReview}>发布</button>
      </div>
      <input
        type="range"
        className="form-range" defaultValue={rev}
        min="1" max="10" id="reviewRange"
        onChange={(event) => {setRev(parseInt(event.target.value))}}
      />
    </>;
  }

  function ReviewSection() {
    return <>
      <ShowReview />
      <AddReview />
    </>;
  }

  function ShowComment() {
    if (commentList === null)
      return <LoadingPage />
    return <>
      {commentList.map((comment) => (
        <div className="input-group">
        {comment.comment} by {comment.username} on {comment.commented_on}
        </div>
      ))}
    </>;
  }

  function AddComment() {
    const [com, setCom] = useState<string | null>(null);
    async function handleAddComment() {
      await axios.post('/api/comment_paper', {paperid: paperInfo.paperid, comment: com}).then((_) => { getComment() }).catch(handleError);
    }
    return <div className="input-group mb-3">
      <span className="input-group-text">评论</span>
      <textarea className="form-control" id="inputDescription" value={com || ''} onChange={(event) => {setCom(event.target.value)}} />
      <button className="input-group-text btn btn-outline-primary" onClick={handleAddComment}>发布</button>
    </div>;
  }

  function CommentSection() {
    return <>
      <ShowComment />
      <AddComment />
      { currentPage && totalPage && <SimplePager currentPage={currentPage} totalPage={totalPage} loadPage={(page: number) => {getComment(page)}} />}
    </>;
  }

  useEffect(() => { getReview(); getComment(1, 3) }, []);

  return <>
    <ReviewSection />
    <CommentSection />
  </>;
}
