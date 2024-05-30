import LoadingPage from "./LoadingPage.tsx";

interface Props {
  currentPage: number
  totalPage: number
  loadPage: Function
}

export default function SimplePager({currentPage, totalPage, loadPage}: Props) {
  function InBetweens() {
    return <li className="page-item"><a className="page-link">{currentPage}</a></li>
  }
  if (currentPage === null || totalPage === null)
    return <LoadingPage />
  return <nav aria-label="Page navigation example">
    <ul className="pagination">
      <li className={"page-item" + (currentPage <= 1 ? " disabled" : "")}>
        <button
          className="page-link"
          disabled={currentPage <= 1}
          onClick={ () => { if (currentPage > 1) loadPage(currentPage - 1) } }
        >
          上一页
        </button>
      </li>
      <InBetweens />
      <li className={"page-item" + (currentPage >= totalPage ? " disabled" : "")}>
        <button
          className="page-link"
          disabled={ currentPage >= totalPage }
          onClick={ () => { if (currentPage < totalPage) loadPage(currentPage + 1) } }
        >
          下一页
        </button>
      </li>
    </ul>
  </nav>
}
