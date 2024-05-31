import { useState } from "react";
import { PaperInfo, SearchBarProps, SearchParamType } from '../Types.tsx';
import ListPage from "../listpage/ListPage.tsx";
import PaperPageSearchBar from "./PaperPageSearchBar.tsx";

interface Props {
  setPaperInfo: Function
  hijackSetSearchParam: (param: SearchParamType) => SearchParamType
}

export default function PaperListPage({setPaperInfo, hijackSetSearchParam}: Props) {
  const [paperInfoList, setPaperInfoList] = useState<Array<PaperInfo> | null>(null);
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
    setItemInfo={setPaperInfo}
    searchParamDefault={hijackSetSearchParam(defaultParam)}
    itemList={paperInfoList || []}
    setItemList={(data_list: object) => {setPaperInfoList(data_list as Array<PaperInfo>)}}
    header={header}
    getApi="/api/search_paper"
    ItemPageSearchBar={UsingPaperPageSearchBar}
    grandName="论文列表"
  />
}
