import { useState } from "react";
import { SearchBarProps, SearchParamType, isSearchPaperParam } from "../Types";
import PaperPageSearchBar from "../paper/PaperPageSearchBar";
import SearchButtons, { Updater, Stater } from "../SearchButtons.tsx";

export default function PaperSetSearchBar({setSearchParam}: SearchBarProps) {
  const [searchStatus, setSearchStatus] = useState('论文库名');
  const [name, setName] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [creater, setCreater] = useState<string | null>(null);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const simpleSearch = ['论文库名', '描述', '创建者'];
  const updaterMap: Updater = {
    '论文库名': setName,
    '描述': setDescription,
    '创建者': setCreater,
  };
  const staterMap: Stater = {
    '论文库名': name,
    '描述': description,
    '创建者': creater,
  };

  function setSearchFilterDefault() {
    setName(null);
    setDescription(null);
    setCreater(null);
    setUseRegex(false);
  }

  async function handleSearch() {
    const params = {
      page: 1,
      per_page: 3,
      name: name,
      description: description,
      creater: creater,
      regex: useRegex,
    };
    console.log('searching paper set with', params);
    setSearchParam(params);
  }

  function handleDropdownClick(statusTo: string) {
    setSearchFilterDefault();
    setSearchStatus(statusTo);
  }

  function ReservedButtonBack() {
    return <li>
      <button className="dropdown-item" onClick={() => {handleDropdownClick('论文库名')}}>
        直接搜索论文库
      </button>
    </li>;
  }

  function ReservedButton() {
    return <li>
      <button className="dropdown-item" onClick={() => {handleDropdownClick('通过论文搜索')}}>
        通过论文搜索
      </button>
    </li>;
  }

  function FancySearchThroughPaper() {
    function transformSearchParam(param: SearchParamType) {
      if (isSearchPaperParam(param))
        setSearchParam({page: 1, per_page: 3, papertitle: param.title, paperuploader: param.uploader, paperjournal: param.journal, paperauthor: param.author});
      else
        setSearchParam(param);
    }
    return <PaperPageSearchBar setSearchParam={transformSearchParam} ReservedButton={ReservedButtonBack} />;
  }

  if (searchStatus === '通过论文搜索')
    return <FancySearchThroughPaper />;
  return <SearchButtons
    simpleSearch={simpleSearch}
    searchStatus={searchStatus}
    handleDropdownClick={handleDropdownClick}
    ReservedButton={ReservedButton}
    handleSearch={handleSearch}
    useRegex={useRegex}
    setUseRegex={setUseRegex}
    setSearchFilterDefault={setSearchFilterDefault}
    updaterMap={updaterMap}
    staterMap={staterMap}
  />;
}
