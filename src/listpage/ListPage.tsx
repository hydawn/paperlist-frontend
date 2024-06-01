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

interface ListPageProps {
  setItemInfo: Function
  searchParamDefault: SearchParamType
  itemList: Array<ItemType>
  setItemList: Function
  header: ItemType
  getApi: string
  ItemPageSearchBar: ({}: SearchBarProps) => JSX.Element
  grandName: string
  buttonName: string
  shouldButtonDisable: (item: ItemType, index: number) => boolean
}

interface ListPageListSectionProps {
  header: ItemType
  itemList: Array<ItemType>
  shouldButtonDisable: (item: ItemType, index: number) => boolean
  ListPager: () => JSX.Element
  setItemInfo: Function
  buttonName: string
}

export function ListPageListSection({ header, itemList, shouldButtonDisable, ListPager, setItemInfo, buttonName }: ListPageListSectionProps) {
  interface PresentItemProps {
    item: ItemType,
    index: number,
  }

  function PresentItem({item, index}: PresentItemProps) {
    function PresentItemDetails() {
      if (isPaperInfo(item)) {
        return <>
          <input type="text" aria-label="Paper Title" value={item.title} readOnly className="form-control paper-title" />
          <input type="text" aria-label="Journal" value={item.journal} readOnly className="form-control paper-journal" />
          <input type="text" aria-label="Pub Date" value={item.publication_date} readOnly className="form-control paper-publication-date" />
          <input type="text" aria-label="Citations" value={item.total_citations} readOnly className="form-control paper-citations" />
        </>;
      }
      if (isPaperSetInfo(item)) {
        return <>
          <input type="text" aria-label="PaperSet Name" value={item.name} readOnly className="form-control paperset-name" />
          <input type="text" aria-label="Description" value={item.description} readOnly className="form-control paperset-description" />
          <input type="text" aria-label="CreatedBy" value={item.username} readOnly className="form-control paperset-creator" />
        </>;
      }
      return <></>;
    }
    function compositeDisable(item: ItemType, index: number) {
      return shouldButtonDisable(item, index) || (index === 0);
    }
    return <div className="input-group mb-3">
      <PresentItemDetails />
      <button className="form-control paper-more" disabled={compositeDisable(item, index)} onClick={() => { setItemInfo(item) }}>{compositeDisable(item, index) ? "" : buttonName}</button>
    </div>;
  }

  function PresentItems() {
    return <div>
      <PresentItem item={header} index={0} />
      {itemList && itemList.map((item, index) => (
        <PresentItem item={item} index={index + 1} />
      ))}
    </div>;
  }

  return <>
    <PresentItems />
    <ListPager />
  </>;
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
      grandName,
      buttonName,
      shouldButtonDisable
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

  const loadPage = (page: number) => {
    const newparam = {...searchParam, page: page};
    setSearchParam(newparam);
    getItem(newparam);
  }

  function ListPager() {
    return <SimplePager currentPage={currentPage} totalPage={totalPage} loadPage={loadPage} />
  }

  return <>
    <h1>{grandName}</h1>
    <ItemPageSearchBar setSearchParam={(params: SearchParamType) => {setSearchParam(params); getItem(params)}} />
    <ListPageListSection header={header} itemList={itemList} shouldButtonDisable={shouldButtonDisable} ListPager={ListPager} setItemInfo={setItemInfo} buttonName={buttonName} />
  </>;
}
