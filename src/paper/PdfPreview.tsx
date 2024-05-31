import { Viewer, Worker } from '@react-pdf-viewer/core';
// import { SpecialZoomLevel } from '@react-pdf-viewer/core';
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import { version as pdfjs_version }  from 'pdfjs-dist/build/pdf';
import '@react-pdf-viewer/core/lib/styles/index.css';

interface Props {
  paperId: string
}

export default function PdfPreview({paperId}: Props) {
  // const defaultLayoutPluginInstance = defaultLayoutPlugin({
  //   sidebarTabs: () => [],
  // });
  //     defaultScale={SpecialZoomLevel.PageFit}
  //     plugins={[defaultLayoutPluginInstance]}

  return <Worker workerUrl={`https://unpkg.com/pdfjs-dist@${pdfjs_version}/build/pdf.worker.min.js`}>
    <Viewer
      fileUrl={`/api/paper_content?paperid=${paperId}&type=bytes&preview_page=1`}
    />
  </Worker> ;
}
