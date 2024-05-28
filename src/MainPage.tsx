import { useState } from 'react';
import SideBar from './SideBar.tsx';
import UserMainPage from './UserMainPage.tsx';
import { Container, Row, Col } from 'react-bootstrap';
import './MainPage.css';

interface Prop {
  setLoginStatus: Function
};

export default function MainPage({setLoginStatus}: Prop) {
  const [onPage, setOnPage] = useState('home');

  const sideBarNames = ['主页', '论文', '论文库'];
  function UserPage() {
    return <Container fluid>
      <Row>
        <Col xs={2} id="sidebar-wrapper">
          <SideBar onPage={onPage} setOnPage={setOnPage} sideBarNames={sideBarNames} />
        </Col>
        <Col xs={10} id="main-content-wrapper">
          <UserMainPage onPage={onPage} setOnPage={setOnPage} setLoginStatus={setLoginStatus} />
        </Col>
      </Row>
    </Container>;
  }
  return <UserPage />;
}
