import LoginSignupPage from './LoginSignupPage.tsx'
import UserHomePage from './UserHomePage.tsx'

function get_login_status() {
  return false;
}

function App() {
  let isLoggedIn = get_login_status();
  let page = <LoginSignupPage />;
  if (isLoggedIn) {
    page = <UserHomePage />;
  }
  return (
    <>
      {page}
    </>
  );
}

export default App
