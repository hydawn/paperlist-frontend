import { useState, useEffect } from "react";

interface PaperInfo {
  id: string,
  name: string,
  text_description: string,
  image_type: string,
  image_description: string,
  online_date: string,
  added_by_user: number
}

async function getPapers(setPaperInfoList: Function, filter: string, page: number, per_page: number) {
}

export default function PaperPage() {
  const [filter, setFilter] = useState<string | null>(null);
  const [paperInfoList, setPaperInfoList] = useState<Array<PaperInfo> | null>(null);
  const [paperPage, setPaperPage] = useState(1);

  return <><h1>论文</h1></>;
}
