export interface PaperInfo {
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

export interface SearchPaperParam {
  page: 1,
  per_page: 10,
  title: '',
  uploader: '',
  journal: '',
  regex: false,
}
