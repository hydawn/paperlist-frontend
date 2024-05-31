import { useState } from "react";
import { PaperInfo, SearchBarProps } from '../Types.tsx';
import ListPage from "../listpage/ListPage.tsx";
import PaperPageSearchBar from "./PaperPageSearchBar.tsx";

interface Props {
  setPaperInfo: Function
}

export default function PaperListPage({setPaperInfo}: Props) {
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
    return <PaperPageSearchBar setSearchParam={setSearchParam} ReservedButton={DummyButton} />
  }

  return <ListPage
    setItemInfo={setPaperInfo}
    searchParamDefault={{page: 1, per_page: 3, title: '', uploader: '', journal: '', author: '', regex: false}}
    itemList={paperInfoList || []}
    setItemList={(data_list: object) => {setPaperInfoList(data_list as Array<PaperInfo>)}}
    header={header}
    getApi="/api/search_paper"
    ItemPageSearchBar={UsingPaperPageSearchBar}
    grandName="论文列表"
  />
}
