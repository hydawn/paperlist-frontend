import { useState } from "react";
import { ItemType, PaperSetInfo, SearchParamType } from '../Types.tsx';
import ListPage from "../listpage/ListPage.tsx";
import PaperSetSearchBar from "./PaperSetSearchBar.tsx";

interface Props {
  setPaperSetInfo: Function
  buttonName: string
  shouldButtonDisable: (item: ItemType, index: number) => boolean
}

export const defaultPaperSetHeader: PaperSetInfo = {
  papersetid: '',
  userid: '',
  username: '建立者',
  name: '论文库名',
  description: '描述',
  is_private: false,
}

export default function PaperSetListPage({setPaperSetInfo, buttonName, shouldButtonDisable}: Props) {
  const [paperSetInfoList, setPaperSetInfoList] = useState<Array<PaperSetInfo> | null>(null);
  const searchDefault: SearchParamType = {page: 1, per_page: 3, name: '', description: '', creator: '', papertitle: '', paperjournal: '', paperuploader: '', paperauthor: '', regex: false}

  return <ListPage
    setItemInfo={setPaperSetInfo}
    searchParamDefault={searchDefault}
    itemList={paperSetInfoList || []}
    setItemList={(data_list: object) => {setPaperSetInfoList(data_list as Array<PaperSetInfo>)}}
    header={defaultPaperSetHeader}
    getApi="/api/search_paperset"
    ItemPageSearchBar={PaperSetSearchBar}
    grandName="论文库列表"
    buttonName={buttonName}
    shouldButtonDisable={shouldButtonDisable}
  />;
}
