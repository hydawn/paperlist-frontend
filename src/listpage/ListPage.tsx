import { useState, useEffect } from "react";
import axios from "axios";
import SimplePager from "../SimplePager.tsx";
import {
  ItemType,
  isPaperInfo,
  isPaperSetInfo,
  SearchParamType,
  SearchBarProps
} from "../Types.tsx";

interface PresentItemProps {
  item: ItemType,
  index: number,
  setItemInfo: Function
}

function PresentItem({item, index, setItemInfo}: PresentItemProps) {
  if (isPaperInfo(item))
    return <div className="input-group mb-3">
      <input type="text" aria-label="Paper Title" value={item.title} readOnly className="form-control paper-title" />
      <input type="text" aria-label="Journal" value={item.journal} readOnly className="form-control paper-journal" />
      <input type="text" aria-label="Pub Date" value={item.publication_date} readOnly className="form-control paper-publication-date" />
      <input type="text" aria-label="Citations" value={item.total_citations} readOnly className="form-control paper-citations" />
      <button className="form-control paper-more" disabled={index === 0} onClick={() => { setItemInfo(item) }}>{index === 0 ? "" : "更多"}</button>
    </div>;
  if (isPaperSetInfo(item))
    return <div className="input-group mb-3">
      <input type="text" aria-label="PaperSet Name" value={item.name} readOnly className="form-control paperset-name" />
      <input type="text" aria-label="Description" value={item.description} readOnly className="form-control paperset-description" />
      <input type="text" aria-label="CreatedBy" value={item.username} readOnly className="form-control paperset-creator" />
      <button className="form-control paper-more" disabled={index === 0} onClick={() => { setItemInfo(item) }}>{index === 0 ? "" : "更多"}</button>
    </div>;
  return <>this is nothing</>;
}

interface ListPageProps {
  setItemInfo: Function
  searchParamDefault: SearchParamType
  itemList: Array<ItemType>
  setItemList: Function
  header: ItemType
  getApi: string
  ItemPageSearchBar: ({}: SearchBarProps) => JSX.Element
  grandName: string
}

export default function ListPage(
    {
      setItemInfo,
      searchParamDefault,
      itemList,
      setItemList,
      header,
      getApi,
      ItemPageSearchBar,
      grandName
    }: ListPageProps
  ) {
  const [searchParam, setSearchParam] = useState(searchParamDefault);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPage, setTotalPage] = useState<number>(1);

  async function getItem(params: object) {
    await axios.get(getApi, { params: params }).then(resp => {
      setItemList(resp.data.data.data_list);
      setCurrentPage(resp.data.data.current_page);
      setTotalPage(resp.data.data.total_page);
      console.log('current: ', resp.data.data.current_page)
    }).catch(resp => { console.error('got error', resp) })
  }

  useEffect(() => {getItem(searchParam)}, []);

  function PresentItems() {
    return <div>
      <PresentItem item={header} index={0} setItemInfo={setItemInfo} />
      {itemList && itemList.map((item, index) => (
        <PresentItem item={item} index={index + 1} setItemInfo={setItemInfo} />
      ))}
    </div>;
  }

  return <>
    <h1>{grandName}</h1>
    <ItemPageSearchBar setSearchParam={(params: SearchParamType) => {setSearchParam(params); getItem(params)}} />
    <PresentItems />
    <SimplePager
      currentPage={currentPage}
      totalPage={totalPage}
      loadPage={(page: number) => {
        const newparam = {...searchParam, page: page};
        setSearchParam(newparam);
        getItem(newparam);
    }} />
  </>;
}
