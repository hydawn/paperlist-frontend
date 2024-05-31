import {PaperSetInfo} from "../Types"

interface Props {
  paperSetInfo: PaperSetInfo
  jumpPaperPage: Function
}

export default function PaperSetDetailPage({paperSetInfo, jumpPaperPage}: Props) {
  return <>detail page for {paperSetInfo.name} here</>
}
