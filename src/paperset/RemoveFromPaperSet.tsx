import axios from 'axios';
import { useState, useEffect } from 'react';
import { defaultPaperSetHeader } from "./PaperSetListPage";
import { PaperSetInfo, isPaperSetInfo } from "../Types";
import { ListPageListSection, HijackButtonProps } from '../listpage/ListPage';
import SimplePager from "../SimplePager.tsx";

interface Props {
  paperId: string
}

export default function RemoveFromPaperSet({ paperId }: Props) {
  /*
   * top: alreadyIn
   * down: toBeRemoved
   */
  const per_page = 3;
  const [toBeRemoved, setToBeRemoved] = useState<Array<PaperSetInfo>>([]);
  const [alreadyIn, setAlreadyIn] = useState<Array<PaperSetInfo>>([]);
  const [message, setMessage] = useState<string | null>(null);

  async function getPaperSet() {
    await axios.get(
      '/api/get_papers_paperset',
      { params: { paperid: paperId, filter: 'mine' } }
    ).then(resp => {
      console.log('got paperset response', resp);
      setAlreadyIn(resp.data.data.data_list as Array<PaperSetInfo>);
    }).catch(resp => {console.error('error', resp)})
  }
  useEffect(() => { getPaperSet() }, []);

  async function removePaper(papersetid: string) {
    await axios.post(
      '/api/delete_from_paperset',
      { papersetid: papersetid, paperid_list: [paperId] }
    ).then(resp => {
      console.log('got response', resp);
      setMessage('成功删除');
    }).catch(err => {
      console.error('error', err);
      setMessage(`删除失败： ${err.response.data.status}: ${err.response.data.error}`);
    })
  }
  function handleRemoveChanges() {
    toBeRemoved.map(item => { removePaper(item.papersetid) });
  }

  console.log('loading remove from paperset')

  function ShowAlreadyIn() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(alreadyIn.length / per_page);
    function ArrayPager() {
      console.log(`already in has length ${alreadyIn.length}`)
      return alreadyIn.slice((currentPage - 1) * per_page, currentPage * per_page);
    }
    function SelectedPager() {
      return <SimplePager currentPage={currentPage} totalPage={totalPage} loadPage={(page: number) => {setCurrentPage(page)}} />
    }
    function HijackButton({className, item, index}: HijackButtonProps) {
      return <button
        className={className}
        disabled={index === 0}
        onClick={() => {
          if (isPaperSetInfo(item)) {
            // add to toBeRemoved
            setToBeRemoved([...toBeRemoved, item]);
            // remove from alreadyIn
            const new_selected = alreadyIn.filter(i => i.papersetid != item.papersetid);
            setAlreadyIn(new_selected);
            setTotalPage(Math.floor(new_selected.length / per_page));
          }
        }}
      >删除</button>
    }
    return <ListPageListSection
      header={defaultPaperSetHeader}
      itemList={ArrayPager()}
      ListPager={SelectedPager}
      HijackButton={HijackButton}
    />;
  }

  function ShowToBeRemoved() {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(toBeRemoved.length / per_page);
    function ArrayPager() {
      console.log(`toBeRemoved has length ${toBeRemoved.length}`)
      return toBeRemoved.slice((currentPage - 1) * per_page, currentPage * per_page);
    }
    function SelectedPager() {
      return <SimplePager currentPage={currentPage} totalPage={totalPage} loadPage={(page: number) => {setCurrentPage(page)}} />
    }
    function HijackButton({className, item, index}: HijackButtonProps) {
      return <button
        className={className}
        disabled={index === 0}
        onClick={() => {
          if (isPaperSetInfo(item)) {
            // remove from toBeRemoved
            const new_selected = alreadyIn.filter(i => i.papersetid != item.papersetid);
            setToBeRemoved(new_selected);
            setTotalPage(Math.floor(new_selected.length / per_page));
            // add to alreadyIn
            setAlreadyIn([...alreadyIn, item]);
          }
        }}
      >取消</button>
    }
    return <ListPageListSection
      header={defaultPaperSetHeader}
      itemList={ArrayPager()}
      ListPager={SelectedPager}
      HijackButton={HijackButton}
    />;
  }

  async function clearMessage() {
    // not so smart but useful
    // sleep 700 ms before reloading the page so that the reload happens after
    // pop up window is closed
    await new Promise(resolve => setTimeout(resolve, 700));
    setMessage(null);
  }

  return <>
    <div className="modal-header">
      <div className="input-group">
        <h1 className="modal-title fs-5" id="removeFromPaperSetModalLabel">从论文库中删除</h1>
      </div>
      <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={clearMessage}></button>
    </div>
    <div className="modal-body">
      { message ? <p>{message}</p> : <><ShowAlreadyIn /><ShowToBeRemoved /></> }
    </div>
    <div className="modal-footer">
      <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="closeRemoveFromPaperSet" onClick={clearMessage}>关闭</button>
      { message ? <></> : <button className="btn btn-primary" onClick={handleRemoveChanges} >确定删除</button> }
    </div>
  </>;
}
