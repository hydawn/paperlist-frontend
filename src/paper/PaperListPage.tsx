import { useState } from "react";
import { PaperInfo, SearchBarProps, SearchParamType } from '../Types.tsx';
import ListPage, { HijackButtonProps } from "../listpage/ListPage.tsx";
import PaperPageSearchBar from "./PaperPageSearchBar.tsx";

interface Props {
  setPaperInfo: Function
  hijackSetSearchParam: (param: SearchParamType) => SearchParamType
}

export default function PaperListPage({setPaperInfo, hijackSetSearchParam}: Props) {
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

  function HijackButton({className, item, index}: HijackButtonProps) {
    return <button
      className={className}
      disabled={index === 0}
      onClick={() => { setPaperInfo(item); }}
    >更多</button>
  }

  return <ListPage
    searchParamDefault={hijackSetSearchParam(defaultParam)}
    header={header}
    getApi="/api/search_paper"
    ItemPageSearchBar={UsingPaperPageSearchBar}
    grandName="论文列表"
    HijackButton={HijackButton}
  />;
}
