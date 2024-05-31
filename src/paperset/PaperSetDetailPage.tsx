import { PaperSetInfo } from "../Types"
import LoadingPage from "../LoadingPage";
import PaperListPage from "../paper/PaperListPage";

interface Props {
  paperSetInfo: PaperSetInfo
  jumpPaperPage: Function
}

export default function PaperSetDetailPage({paperSetInfo, jumpPaperPage}: Props) {
  function PresentPaperSetDetail() {
    function Description() {
      return <><div className="input-group mb-3">
        <span className="input-group-text">描述</span>
        <input type="text" className="form-control" value={paperSetInfo.description} readOnly disabled />
        <button
          className="input-group-text btn btn-primary"
          data-bs-toggle="collapse" data-bs-target="#collapseExample"
          aria-expanded="false" aria-controls="collapseExample">
          更多
        </button>
      </div>
      <div className="collapse mb-3" id="collapseExample">
        <div className="card card-body">
          {paperSetInfo.description}
        </div>
      </div></>;
    }

    return <>
      <h1>{paperSetInfo.name}</h1>
      <Description />
      <PaperListPage setPaperInfo={jumpPaperPage} hijackSetSearchParam={(param) => { return {...param, papersetid: paperSetInfo.papersetid} }} />
    </>;
  }

  // <PaperSetReview paperInfo={paperInfo} />
  if (paperSetInfo === null)
    return <LoadingPage />;
  return <>
    <PresentPaperSetDetail />
  </>;
}
