const Lifelines = ({
  usedLifelines,
  status,
  onFiftyFifty,
  onAskAudience,
  onStop,
}) => {
  const disabled = status !== "answering";

  return (
    <div className="lifelines">
      <button
        className="primary-btn"
        disabled={disabled || usedLifelines.fiftyFifty}
        onClick={onFiftyFifty}
      >
        {usedLifelines.fiftyFifty
          ? "50:50 (Đã dùng)"
          : "50:50"}
      </button>

      <button
        className="primary-btn"
        disabled={disabled || usedLifelines.audience}
        onClick={onAskAudience}
      >
        {usedLifelines.audience
          ? "Hỏi khán giả (Đã dùng)"
          : "Hỏi khán giả"}
      </button>

      <button
        className="stop-btn"
        disabled={disabled}
        onClick={onStop}
      >
        Dừng cuộc chơi
      </button>
    </div>
  );
};

export default Lifelines;
