import { CommentSection, ReviewSection, handleError } from "../ReviewPage";
import axios, {AxiosResponse}  from "axios";
import { PaperInfo } from "../Types";

interface Props {
  paperInfo: PaperInfo
}

export default function PaperReview({paperInfo}: Props) {
  async function getReview(onSuccess: (arg0: AxiosResponse) => AxiosResponse) {
    await axios.get(
      '/api/get_paper_review',
      {params:{ paperid: paperInfo.paperid }}
    ).then(onSuccess).catch(handleError);
  }

  async function getComment(page: number = 1, per_page: number = 3, onSuccess: (arg0: AxiosResponse) => AxiosResponse) {
    await axios.get(
      '/api/search_paper_comment',
      {params:{ paperid: paperInfo.paperid, page: page, per_page: per_page }}
    ).then(onSuccess).catch(handleError);
  }

  return <>
    <ReviewSection getFromWeb={getReview} pushToWeb={async (star: number, onSuccess: Function) => {
      await axios.post('/api/review_paper', {paperid: paperInfo.paperid, star: star}).then((_) => { onSuccess() }).catch(handleError);
    }} />
    <CommentSection getFromWeb={getComment} pushToWeb={async (comment: string, onSuccess: Function) => {
      await axios.post('/api/comment_paper', {paperid: paperInfo.paperid, comment: comment}).then((_) => { onSuccess() }).catch(handleError);
    }} />
  </>;
}
