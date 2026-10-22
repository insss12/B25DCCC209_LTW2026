
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home">
      <h1>Ai là triệu phú?</h1>

      <p>
        Trò chơi trắc nghiệm kiến thức Lập trình Web.
      </p>

      <p>
        Trả lời 15 câu hỏi để chinh phục giải thưởng
        15$
      </p>

      <Link className="primary-btn" to="/questions">
        Xem ngân hàng câu hỏi
      </Link>
    </div>
  );
};

export default Home;
