import { PaperSetInfo, SearchParamType } from '../Types.tsx';
import ListPage, { HijackButtonProps } from "../listpage/ListPage.tsx";
import PaperSetSearchBar from "./PaperSetSearchBar.tsx";

interface Props {
  setPaperSetInfo: Function
}

export const defaultPaperSetHeader: PaperSetInfo = {
  papersetid: '',
  userid: '',
  username: '建立者',
  name: '论文库名',
  description: '描述',
  is_private: false,
  can_modify: false,
  can_comment: false
}

export default function PaperSetListPage({ setPaperSetInfo }: Props) {
  const searchDefault: SearchParamType = {page: 1, per_page: 3, name: '', description: '', creator: '', papertitle: '', paperjournal: '', paperuploader: '', paperauthor: '', regex: false}

  function HijackButton({className, item, index}: HijackButtonProps) {
    return <button
      className={className}
      disabled={index === 0}
      onClick={() => { setPaperSetInfo(item); }}
    >{index === 0 ? "" : "更多"}</button>
  }

  return <ListPage
    searchParamDefault={searchDefault}
    header={defaultPaperSetHeader}
    getApi="/api/search_paperset"
    ItemPageSearchBar={PaperSetSearchBar}
    grandName="论文库列表"
    HijackButton={HijackButton}
  />;
}
