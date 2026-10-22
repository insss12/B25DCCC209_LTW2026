import {
  useOutletContext,
  useNavigate,
} from "react-router-dom";

const Home = () => {
  const { playerName, setPlayerName } =
    useOutletContext();

  const navigate = useNavigate();

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
        Trả lời 15 câu hỏi.
      </p>

      <p>
        Mỗi câu có 30 giây.
        giải thưởng 250.000.000 đ.
      </p>

      <p>
        Câu 5, 10 và 15 là các mốc an toàn.
      </p>

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
