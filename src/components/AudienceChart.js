import { LETTERS } from "../data";

const AudienceChart = ({ percentages }) => {
  return (
    <div className="audience-chart">
      <h3>Kết quả bình chọn của khán giả</h3>

      {percentages.map((percent, index) => (
        <div className="audience-row" key={index}>
          <div className="audience-label">
            {LETTERS[index]}: {percent}%
          </div>

          <div className="audience-track">
            <div
              className="audience-bar"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AudienceChart;
