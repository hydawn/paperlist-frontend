import { useState } from "react";

interface Props {
  setSearchParam: Function
}

export default function PaperPageSearchBar({setSearchParam}: Props) {
  const [searchStatus, setSearchStatus] = useState('题目');
  const [title, setTitle] = useState<string | null>(null);
  const [uploader, setUploader] = useState<string | null>(null);
  const [journal, setJournal] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const simpleSearch = ['题目', '期刊', '上传者', '作者'];

  // reset all filters to default
  function setSearchFilterDefault() {
    setTitle(null);
    setUploader(null);
    setJournal(null);
    setAuthor(null);
    setUseRegex(false);
  }

  async function handleSearch() {
    const params = {
      page: 1,
      per_page: 3,
      title: title,
      uploader: uploader,
      journal: journal,
      regex: useRegex,
      author: author,
    };
    console.log('searching with', params);
    setSearchParam(params);
  }

  function handleDropdownClick(statusTo: string) {
    setSearchFilterDefault();
    setSearchStatus(statusTo);
  }

  function DropdownButton() {
    return <>
      <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{searchStatus}</button>
      <ul className="dropdown-menu dropdown-menu-end">
        { simpleSearch.map((item, index) => (
          <li key={index}>
            <button
              className="dropdown-item"
              disabled={item === searchStatus}
              onClick={() => {handleDropdownClick(item)}}
            >
              {item}
            </button>
          </li>
        )) }
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item" disabled={searchStatus === '高级搜索'} onClick={() => {handleDropdownClick('高级搜索')}} >高级搜索</button></li>
      </ul>
    </>;
  }

  function SimpleSearchButton() {
    return <button className="form-control paper-more" onClick={handleSearch}>搜索</button>;
  }

  function SimpleSearch() {
    // a map from string to function
    // type SearchStatus = '题目' | '期刊' | '上传者';
    const updaterMap: { [key: string]: React.Dispatch<React.SetStateAction<string | null>> } = {
      '题目': setTitle,
      '期刊': setJournal,
      '上传者': setUploader,
      '作者': setAuthor,
    };
    const staterMap: { [key: string]: string | null } = {
      '题目': title,
      '期刊': journal,
      '上传者': uploader,
      '作者': author,
    };
    return <div className="input-group mb-3">
      <input
        onBlur={(event) => {
          setSearchFilterDefault();
          updaterMap[searchStatus](event.target.value);
          }}
        type="text"
        defaultValue={staterMap[searchStatus] || ''}
        className="form-control" aria-label="Text input with dropdown button" />
      <SimpleSearchButton />
      <DropdownButton />
    </div>;
  }

  function RegexDropdownButton() {
    return <>
      <button className="btn btn-outline-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">{!useRegex ? '普通' : '正则'}搜索</button>
      <ul className="dropdown-menu dropdown-menu-end">
        <li><button className="dropdown-item" disabled={useRegex} onClick={() => {setUseRegex(true)}}>使用正则</button></li>
        <li><button className="dropdown-item" disabled={!useRegex} onClick={() => {setUseRegex(false)}}>不使用正则</button></li>
      </ul>
    </>;
  }

  function FancySearch() {
    return <div className="input-group mb-3">
      <div className="form-floating">
        <input onBlur={(event) => {setTitle(event.target.value)}} type="text" id="search-title" aria-label="Search Title" defaultValue={title || ''} className="form-control searchpaper-title" />
        <label htmlFor="search-title">题目</label>
      </div>

      <div className="form-floating">
        <input onBlur={(event) => {setJournal(event.target.value)}} type="text" id="search-journal" aria-label="Search Journal" defaultValue={journal || ''} className="form-control searchpaper-journal" />
        <label htmlFor="search-journal">期刊</label>
      </div>

      <div className="form-floating">
        <input onBlur={(event) => {setUploader(event.target.value)}} type="text" aria-label="Search Uploader" defaultValue={uploader || ''} className="form-control searchpaper-uploader" />
        <label htmlFor="search-journal">上传者</label>
      </div>

      <div className="form-floating">
        <input onBlur={(event) => {setAuthor(event.target.value)}} type="text" aria-label="Search Author" defaultValue={uploader || ''} className="form-control searchpaper-author" />
        <label htmlFor="search-journal">作者</label>
      </div>

      <SimpleSearchButton />
      <RegexDropdownButton />
      <DropdownButton />
    </div>;
  }

  if (searchStatus === '高级搜索')
    return <FancySearch />;
  return <SimpleSearch />
}
