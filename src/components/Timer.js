const Timer = ({ remaining }) => {
  return (
    <p
      className={
        remaining <= 10 ? "timer warning" : "timer"
      }
    >
      Còn {remaining} giây
    </p>
  );
};

export default Timer;
