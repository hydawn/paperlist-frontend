export type PaperInfo = {
  paperid: string,
  userid: string,
  username: string,
  title: string,
  abstract: string,
  file_name: string,
  file_content: string,
  publication_date: string,
  journal: string,
  total_citations: number | string,
  is_private: boolean,
  authors: Array<string>,
}

export interface Comment {
  userid: string,
  username: string,
  comment: string,
  commented_on: string,
}

export type SearchPaperParam = {
  page: number,
  per_page: number,
  title: string,
  uploader: string,
  journal: string,
  author: string,
  regex: boolean,
  papersetid: string,
}

export type PaperSetInfo = {
  papersetid: string,
  userid: string,
  username: string,
  name: string,
  description: string,
  is_private: boolean,
  can_modify: boolean,
  can_comment: boolean,
}

export type SearchPaperSetParam = {
  page: number,
  per_page: number,
  name: string,
  description: string,
  creator: string,
  papertitle: string,
  paperuploader: string,
  paperjournal: string,
  paperauthor: string,
  regex: boolean,
}

export type ItemType = PaperInfo | PaperSetInfo;
export type SearchParamType = SearchPaperParam | SearchPaperSetParam;

export function isSearchPaperParam(item: SearchParamType): item is SearchPaperParam {
  return !('papertitle' in item);
}

export interface SearchBarProps {
  setSearchParam: Function
}

export function isPaperInfo(item: ItemType): item is PaperInfo {
  return !('description' in item);
}

export function isPaperSetInfo(item: ItemType): item is PaperSetInfo {
  return ('description' in item);
}

export interface ReservedButtonProps {
  searchStatus: string
}
