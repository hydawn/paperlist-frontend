import { useState } from "react";
import SearchButtons, { Updater, Stater } from "../SearchButtons.tsx";

interface Props {
  setSearchParam: Function
  ReservedButton: () => JSX.Element
}

export default function PaperPageSearchBar({setSearchParam, ReservedButton }: Props) {
  const [searchStatus, setSearchStatus] = useState('题目');
  const [title, setTitle] = useState<string | null>(null);
  const [uploader, setUploader] = useState<string | null>(null);
  const [journal, setJournal] = useState<string | null>(null);
  const [author, setAuthor] = useState<string | null>(null);
  const [useRegex, setUseRegex] = useState<boolean>(false);
  const simpleSearch = ['题目', '期刊', '上传者', '作者'];
  // a map from string to function
  const updaterMap: Updater = {
    '题目': setTitle,
    '期刊': setJournal,
    '上传者': setUploader,
    '作者': setAuthor,
  };
  const staterMap: Stater = {
    '题目': title,
    '期刊': journal,
    '上传者': uploader,
    '作者': author,
  };

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
