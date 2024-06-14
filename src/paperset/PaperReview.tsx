import { CommentSection } from "../ReviewPage";
import axios, {AxiosResponse}  from "axios";
import { PaperSetInfo } from "../Types";
import { handleError } from "../Functions";

interface Props {
  paperSetInfo: PaperSetInfo
}

export default function PaperSetReview({paperSetInfo}: Props) {
  async function getComment(page: number = 1, per_page: number = 3, onSuccess: (resp: AxiosResponse) => AxiosResponse) {
    await axios.get(
      '/api/search_paperset_comment',
      {params:{ papersetid: paperSetInfo.papersetid, page: page, per_page: per_page }}
    ).then(onSuccess).catch(handleError);
  }

  return <>
    <CommentSection getFromWeb={getComment} pushToWeb={async (comment: string, onSuccess: Function) => {
      await axios.post(
        '/api/comment_paperset',
        {papersetid: paperSetInfo.papersetid, comment: comment}
      ).then((_) => { onSuccess() }).catch(handleError);
    }} />
  </>;
}
