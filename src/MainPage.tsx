import { useState } from 'react';
import SideBar from './SideBar.tsx';
import UserHomePage from './UserHomePage.tsx'
import PaperPage from './paper/PaperPage.tsx'
import PaperSetPage from './paperset/PaperSetPage.tsx';
import { Container, Row, Col } from 'react-bootstrap';
import { PaperInfo } from './Types.tsx';
import './MainPage.css';

interface Prop {
  setLoginStatus: Function
};

export default function MainPage({setLoginStatus}: Prop) {
  // const [onPage, setOnPage] = useState('论文库');
  const [onPage, setOnPage] = useState('论文');
  const [givenPaperInfo, setGivenPaperInfo] = useState<PaperInfo | null>(null);

  function MainPageWindow() {
    switch (onPage) {
      case '论文库':
        return <PaperSetPage jumpPaperPage={(paperInfo: PaperInfo) => { setGivenPaperInfo(paperInfo); setOnPage('论文') }} />;
      case '论文':
        return <PaperPage givenPaperInfo={givenPaperInfo} />;
      default:
        return <UserHomePage setLoginStatus={setLoginStatus} />;
    }
  }

  const sideBarNames = ['主页', '论文', '论文库'];

  return <Container fluid>
    <Row>
      <Col xs={2} id="sidebar-wrapper">
        <SideBar onPage={onPage} setOnPage={setOnPage} sideBarNames={sideBarNames} />
      </Col>
      <Col xs={10} id="main-content-wrapper">
        <MainPageWindow />
      </Col>
    </Row>
  </Container>;
}
