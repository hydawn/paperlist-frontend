import { PaperInfo, SearchBarProps, SearchParamType } from '../Types.tsx';
import ListPage, { HijackButtonProps } from "../listpage/ListPage.tsx";
import PaperPageSearchBar from "./PaperPageSearchBar.tsx";
import ReloadContext from "../ReloadContext.tsx";

interface Props {
  hijackSetSearchParam: (param: SearchParamType) => SearchParamType
  HijackButton: ({}: HijackButtonProps) => JSX.Element
}

export default function PaperListPage({hijackSetSearchParam, HijackButton}: Props) {
  const header: PaperInfo = {
    paperid: '',
    userid: '',
    username: '',
    title: '题目',
    abstract: '',
    file_name: '',
    file_content: '',
    publication_date: '发表日期',
    journal: '发表期刊',
    total_citations: '引用数',
    is_private: false,
    authors: [],
  }

  function UsingPaperPageSearchBar({setSearchParam}: SearchBarProps) {
    function DummyButton() { return <></> }
    function hijackSetParam(param: SearchParamType) {
      setSearchParam(hijackSetSearchParam(param));
    }
    return <PaperPageSearchBar setSearchParam={hijackSetParam} ReservedButton={DummyButton} />
  }

  const defaultParam = {page: 1, per_page: 3, papersetid: '', title: '', uploader: '', journal: '', author: '', regex: false};

  return <ListPage
    searchParamDefault={hijackSetSearchParam(defaultParam)}
    header={header}
    getApi="/api/search_paper"
    ItemPageSearchBar={UsingPaperPageSearchBar}
    grandName="论文列表"
    HijackButton={HijackButton}
  />;
}
