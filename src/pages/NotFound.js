import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="not-found">
      <h1>404 - Không tìm thấy trang</h1>

      <Link className="primary-btn" to="/">
        Về trang chủ
      </Link>
    </div>
  );
};

export default NotFound;
