import {
  useNavigate,
  useOutletContext,
} from "react-router-dom";

import { formatMoney } from "../data";

const Home = () => {
  const {
    playerName,
    setPlayerName,
    history,
  } = useOutletContext();

  const navigate = useNavigate();

  const bestRecord =
    history.length > 0
      ? history.reduce((best, item) =>
          item.prize > best.prize ? item : best
        )
      : null;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (playerName.trim()) {
      navigate("/play");
    }
  };

  return (
    <section className="home page-box">
      <h1>Ai là triệu phú?</h1>

      <p>
        Trả lời 15 câu hỏi về HTML, CSS, JavaScript và React.
      </p>

      <p>Mỗi câu có 30 giây để suy nghĩ.</p>

      <p>
        Trả lời đúng 15 câu để nhận
        {" "}250.000.000 đ!
      </p>

      <p>
        Câu 5, 10 và 15 là các mốc an toàn.
      </p>

      {bestRecord && (
        <p className="record">
          Kỷ lục: {formatMoney(bestRecord.prize)}
          {" – "}{bestRecord.name}
        </p>
      )}

      <form
        className="name-form"
        onSubmit={handleSubmit}
      >
        <label htmlFor="playerName">
          Tên người chơi
        </label>

        <input
          id="playerName"
          type="text"
          value={playerName}
          placeholder="Nhập tên của bạn"
          onChange={(event) =>
            setPlayerName(event.target.value)
          }
        />

        <button
          className="primary-btn"
          type="submit"
          disabled={!playerName.trim()}
        >
          Bắt đầu
        </button>
      </form>
    </section>
  );
};

export default Home;
