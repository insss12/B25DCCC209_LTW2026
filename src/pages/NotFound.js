import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="page-box">
      <h1>404 - Không tìm thấy trang</h1>

      <Link className="primary-btn" to="/">
        Về trang chủ
      </Link>
    </section>
  );
};

export default NotFound;
