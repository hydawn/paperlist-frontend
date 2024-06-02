import { useState, useEffect } from "react";
import { defaultPaperSetHeader } from "./PaperSetListPage";
import { PaperSetInfo, isPaperSetInfo } from "../Types";
import { ListPageListSection, HijackButtonProps } from '../listpage/ListPage';
import SimplePager from "../SimplePager.tsx";
import axios from "axios";

interface Props {
  paperId: string
}

export default function AddToPaperSet({ paperId }: Props) {
  // get users's paper set, present them and chose which to add
  // already added ones will be grey
  const per_page = 3;
  const [alreadyIn, setAlreadyIn] = useState<Array<PaperSetInfo>>([]);
  const [selected, setSelected] = useState<Array<PaperSetInfo>>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function getPaperSet() {
    await axios.get(
      '/api/get_papers_paperset',
      { params: { paperid: paperId, filter: 'mine' } }
    ).then(resp => {
      setAlreadyIn(resp.data.data.data_list as Array<PaperSetInfo>);
    }).catch(resp => {console.error('error', resp)})
  }
  useEffect(() => { getPaperSet() }, []);

  async function addPaper(papersetid: string) {
    await axios.post(
      '/api/add_to_paperset',
      { papersetid: papersetid, paperid_list: [paperId] }
    ).then((_) => {
      setMessage('添加成功');
    }
    ).catch(err => {
      console.error('error', err);
      setMessage(`添加失败： ${err.response.data.status}: ${err.response.data.error}`);
    })
  }

  function handleAddChanges() {
    selected.map(item => { addPaper(item.papersetid) });
  }

  function ShowSelected() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(selected.length / per_page);
    function ArrayPager() {
      return alreadyIn.concat(selected).slice((currentPage - 1) * per_page, currentPage * per_page);
    }
    function SelectedPager() {
      return <SimplePager currentPage={currentPage} totalPage={totalPage} loadPage={(page: number) => {setCurrentPage(page)}} />
    }
    function HijackButton({className, item, index}: HijackButtonProps) {
      const disabled = () => {
        if (index === 0)
          return true;
        if (isPaperSetInfo(item))
          return alreadyIn.map(i => i.papersetid).includes(item.papersetid);
        return false
      }
      return <button
        className={className}
        disabled={disabled()}
        onClick={() => {
          if (isPaperSetInfo(item)) {
            // delete from selected
            const new_selected = selected.filter(i => i.papersetid != item.papersetid);
            setSelected(new_selected);
            setTotalPage(new_selected.length);
          }
        }}
      >{ disabled() ? "" : "取消选择" }</button>
    }
    return <ListPageListSection
      header={defaultPaperSetHeader}
      itemList={ArrayPager()}
      ListPager={SelectedPager}
      HijackButton={HijackButton}
    />;
  }

  const [currentPageSelecting, setCurrentPageSelecting] = useState<number>(1);
  const [totalPageSelecting, setTotalPageSelecting] = useState<number>(selected.length / per_page);
  const [toBeSelected, setToBeSelected] = useState<Array<PaperSetInfo>>([]);

  async function getToBeSelected(page: number) {
    await axios.get(
      '/api/search_paperset',
      { params: { paperid: paperId, creater_me: true, page: page, per_page: per_page }}
    ).then(async resp => {
      await new Promise(resolve => setTimeout(resolve, 500));
      setToBeSelected(resp.data.data.data_list as Array<PaperSetInfo>);
      setCurrentPageSelecting(parseInt(resp.data.data.current_page));
      setTotalPageSelecting(parseInt(resp.data.data.total_page));
    }).catch(err => { console.error(err) });
  }
  useEffect(() => {
    getToBeSelected(currentPageSelecting);
  }, []);

  function SelectingPage() {
    function SelectedPager() {
      return <SimplePager currentPage={currentPageSelecting} totalPage={totalPageSelecting} loadPage={async (page: number) => {
        await new Promise(resolve => setTimeout(resolve, 600));
        getToBeSelected(page);
      }} />;
    }
    function HijackButton({className, item, index}: HijackButtonProps) {
      const shouldButtonDisable = () => {
        if (index === 0)
          return true;
        if (isPaperSetInfo(item))
          return alreadyIn.concat(selected).map(i => i.papersetid).includes(item.papersetid);
        return false;
      }
      return <button
        className={className}
        disabled={shouldButtonDisable()}
        onClick={() => {
          if (isPaperSetInfo(item)) {
            setSelected([...selected, item]);
          }
        }}
      >{shouldButtonDisable() ? "" : "选择"}</button>
    }
    return <ListPageListSection
      header={defaultPaperSetHeader}
      itemList={toBeSelected}
      ListPager={SelectedPager}
      HijackButton={HijackButton}
    />;
  }

  async function clearMessage() {
    await new Promise(resolve => setTimeout(resolve, 700));
    setMessage(null);
  }

  return <>
    <div className="modal-header">
      <div className="input-group">
        <h1 className="modal-title fs-5" id="addToPaperSetModalLabel">添加到论文库</h1>
      </div>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearMessage}></button>
    </div>
    <div className="modal-body">
      { message ? <p>{message}</p> : <><ShowSelected /><SelectingPage /></> }
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={clearMessage}>关闭</button>
      { message ? <></> : <button type="button" className="btn btn-primary" onClick={handleAddChanges}>确定添加</button> }
    </div>
  </>;
}
