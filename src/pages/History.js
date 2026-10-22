import { useOutletContext } from "react-router-dom";
import { formatMoney } from "../data";

const History = () => {
  const { history, setHistory } = useOutletContext();

  const sortedHistory = [...history].sort(
    (a, b) => b.prize - a.prize
  );

  const highestPrize = history.reduce(
    (max, item) => Math.max(max, item.prize),
    0
  );

  const totalPrize = history.reduce(
    (total, item) => total + item.prize,
    0
  );

  const handleClearHistory = () => {
    setHistory([]);
  };

  return (
    <section className="history-page page-box">
      <h1>Lịch sử chơi</h1>

      <div className="history-stats">
        <p>Số lượt chơi: {history.length}</p>

        <p>
          Tiền thưởng cao nhất:{" "}
          {formatMoney(highestPrize)}
        </p>

        <p>
          Tổng tiền thưởng: {formatMoney(totalPrize)}
        </p>
      </div>

      {history.length === 0 ? (
        <p>Chưa có lượt chơi nào.</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Người chơi</th>
                <th>Số câu đúng</th>
                <th>Tiền thưởng</th>
                <th>Thời gian</th>
              </tr>
            </thead>

            <tbody>
              {sortedHistory.map((item) => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.correctCount}</td>
                  <td>{formatMoney(item.prize)}</td>
                  <td>{item.playedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="stop-btn"
            onClick={handleClearHistory}
          >
            Xóa lịch sử
          </button>
        </>
      )}
    </section>
  );
};

export default History;
