import { useState } from 'react';
import SideBar from './SideBar.tsx';
import UserHomePage from './UserHomePage.tsx'
import PaperPage from './PaperPage.tsx'
import PaperSetPage from './PaperSetPage.tsx';
import { Container, Row, Col } from 'react-bootstrap';
import './MainPage.css';

interface Prop {
  setLoginStatus: Function
};

export default function MainPage({setLoginStatus}: Prop) {
  const [onPage, setOnPage] = useState('home');

  function MainPageWindow() {
    switch (onPage) {
      case '论文库':
        return <PaperSetPage setOnPage={setOnPage} />;
      case '论文':
        return <PaperPage setOnPage={setOnPage} />;
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
