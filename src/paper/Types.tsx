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
}
