
import { NavLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="brand">AI LÀ TRIỆU PHÚ</div>

      <div className="nav-links">
        <NavLink to="/" end>
          Trang chủ
        </NavLink>

        <NavLink to="/questions">
          Ngân hàng câu hỏi
        </NavLink>

        <NavLink to="/history">
          Lịch sử
        </NavLink>
      </div>
    </nav>
  );
};

export default NavBar;
