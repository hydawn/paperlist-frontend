import { useState } from "react";
import { PaperSetInfo, SearchParamType } from '../Types.tsx';
import ListPage from "../listpage/ListPage.tsx";
import PaperSetSearchBar from "./PaperSetSearchBar.tsx";

interface Props {
  setPaperSetInfo: Function
}

export default function PaperSetListPage({setPaperSetInfo}: Props) {
  const [paperSetInfoList, setPaperSetInfoList] = useState<Array<PaperSetInfo> | null>(null);
  const searchDefault: SearchParamType = {page: 1, per_page: 3, name: '', description: '', creator: '', papertitle: '', paperjournal: '', paperuploader: '', paperauthor: '', regex: false}

  const header: PaperSetInfo = {
    userid: '',
    username: '建立者',
    name: '论文库名',
    description: '描述',
    is_private: false,
  }

  return <ListPage
    setItemInfo={setPaperSetInfo}
    searchParamDefault={searchDefault}
    itemList={paperSetInfoList || []}
    setItemList={(data_list: object) => {setPaperSetInfoList(data_list as Array<PaperSetInfo>)}}
    header={header}
    getApi="/api/search_paperset"
    ItemPageSearchBar={PaperSetSearchBar}
    grandName="论文库列表"
  />;
}
