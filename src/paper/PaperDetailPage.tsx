import axios from "axios";

interface Props {
  paperId: string
}

export default function PaperDetailPage({paperId}: Props) {
  return <>paper page of {paperId}</>
}
