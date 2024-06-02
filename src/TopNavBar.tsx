interface TopNavBarProps {
  windowList: Array<string>
  onWindow: string
  setOnWindow: Function
  disableThis: Function
}

export default function TopNavBar({windowList, onWindow, setOnWindow, disableThis}: TopNavBarProps) {
  function NonDropdownButtons() {
    return windowList.map((item, index) => (
      <li className="nav-item" key={"dropdown-index-" + index}>
        <a className={"nav-link" + (item == onWindow ? " active" : (disableThis(item) ? " disabled" : ""))} role="button" aria-current="page" onClick={() => {setOnWindow(item)}}>{item}</a>
      </li>
    ))
  }
  return <nav className="navbar navbar-expand-lg bg-primary" data-bs-theme="dark">
    <div className="container-fluid">
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav me-auto mb-2 mb-lg-0">
          <NonDropdownButtons />
        </ul>
      </div>
    </div>
  </nav>;
}
