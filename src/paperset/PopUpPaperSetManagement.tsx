import AddToPaperSet from "./AddToPaperSet.tsx"
import RemoveFromPaperSet from "./RemoveFromPaperSet.tsx";

interface Props {
  paperid: string
}

export default function PopUpPaperSetManagement({paperid}: Props) {
  // const [userId, setUserId] = useState<string | null>(null);
  // async function getUserId() {
  //   await axios.get('/api/userid').then(resp => {
  //     console.log(`got user id [${resp.data.data.userid}]`);
  //     setUserId(resp.data.data.userid);
  //   }).catch(err => {
  //     console.error('got error', err)
  //   });
  // }

  function AddPaperModal() {
    return <><div className="modal fade" id="addToPaperSetModal" tabIndex={-1} aria-labelledby="addToPaperSetModal" aria-hidden="true">
        <div className="modal-dialog modal-xl">
          <div className="modal-content">
          <AddToPaperSet paperId={paperid} />
          </div>
        </div>
      </div>
    </>;
  }

  function RemovePaperModal() {
    return <div className="modal fade" id="removeFromPaperSetModal" aria-hidden="false" aria-labelledby="removeFromPaperSetModal" tabIndex={-1}>
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <RemoveFromPaperSet paperId={paperid} />
        </div>
      </div>
    </div>
  }

  // BUG: here, if you add on one page, the other page will not reload, but if
  // you pass a set state function to a pop up, the pop up's updating move will
  // trigger the outer container to rerender and ruin your pop up state, that
  // can be fixed for sure but I don't know how yet, tired of working with
  // frontend rerendering logic that I don't fully understand
  // NOTE: you know what, may be it's better to just move the whole thing to
  // another navbar page instead of doing a pop up menu
  return <>
    <button type="button" className="input-group-text btn btn-primary" data-bs-toggle="modal" data-bs-target="#addToPaperSetModal">
      添加到论文库
    </button>
    <AddPaperModal />
    <button type="button" className="input-group-text btn btn-danger" data-bs-toggle="modal" data-bs-target="#removeFromPaperSetModal">
      从论文库中删除
    </button>
    <RemovePaperModal />
  </>
}
