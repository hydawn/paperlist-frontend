import { PaperInfo } from '../Types';
import PdfPreview from './PdfPreview';

interface Props {
  paperInfo: PaperInfo,
}

export default function PaperPreview({paperInfo}: Props) {
  return <PdfPreview paperId={paperInfo.paperid} />;
}
