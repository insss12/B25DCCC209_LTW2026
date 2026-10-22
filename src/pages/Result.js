
import {
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import { formatMoney } from "../data";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const result = location.state;

  if (!result) {
    return <Navigate to="/" replace />;
  }

  let title = "";

  if (result.reason === "win") {
    title = "Chúc mừng! Bạn đã trở thành triệu phú";
  } else if (result.reason === "wrong") {
    title = "Rất tiếc, bạn đã trả lời sai";
  } else if (result.reason === "timeout") {
    title = "Hết giờ!";
  } else if (result.reason === "stop") {
    title = "Bạn đã dừng cuộc chơi";
  }

  return (
    <section className="result page-box">
      <h1>{title}</h1>

      <p>
        Người chơi: <strong>{result.playerName}</strong>
      </p>

      <p>
        Số câu trả lời đúng:{" "}
        <strong>{result.correctCount}</strong>
      </p>

      <p>
        Tiền thưởng:{" "}
        <strong>{formatMoney(result.prize)}</strong>
      </p>

      <button
        className="primary-btn"
        onClick={() =>
          navigate("/play", { replace: true })
        }
      >
        Chơi lại
      </button>

      <button
        className="secondary-btn"
        onClick={() =>
          navigate("/", { replace: true })
        }
      >
        Về trang chủ
      </button>
    </section>
  );
};

export default Result;
