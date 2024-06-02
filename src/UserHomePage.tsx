import InfoPage from './userhome/InfoPage.tsx';

interface Props {
  setLoginStatus: Function
}

export default function UserHomePage({setLoginStatus}: Props) {
  // const [page, setPage] = useState('信息');
  // const [givenPaperInfo, setGivenPaperInfo] = useState<PaperInfo | null>(null);
  //  <TopNavBar page={page} setPage={setPage} />
  //   {page === '论文' && <PaperPage givenPaperInfo={givenPaperInfo} />}
  //   {page === '论文库' && <PaperSetPage jumpPaperPage={(paperInfo: PaperInfo) => { setPage('论文'); setGivenPaperInfo(paperInfo)}} />}
  //   {page === '添加论文' && <AddPaper />}
  //   {page === '添加论文库' && <AddPaperSet />}
  //  {page === '信息' && <InfoPage setLoginStatus={setLoginStatus} />}

  return (<>
    <InfoPage setLoginStatus={setLoginStatus} />
  </>);
}
