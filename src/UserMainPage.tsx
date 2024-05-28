import UserHomePage from './UserHomePage.tsx'
import PaperPage from './PaperPage.tsx'
import PaperSetPage from './PaperSetPage.tsx';

interface Props {
  onPage: string,
  setOnPage: Function,
  setLoginStatus: Function,
}

export default function UserMainPage({ onPage, setOnPage, setLoginStatus }: Props) {
  switch (onPage) {
    case '论文库':
      return <PaperSetPage setOnPage={setOnPage} />;

    case '论文':
      return <PaperPage setOnPage={setOnPage} />;

    default:
      return <UserHomePage setLoginStatus={setLoginStatus} />;
  }
}
