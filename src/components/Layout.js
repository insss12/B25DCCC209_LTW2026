import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({
  questions,
  loading,
  error,
  playerName,
  setPlayerName,
  history,
  setHistory,
  recordHistory,
}) => {
  return (
    <div className="app">
      <NavBar />

      <main className="container">
        <Outlet
          context={{
            questions,
            loading,
            error,
            playerName,
            setPlayerName,
            history,
            setHistory,
            recordHistory,
          }}
        />
      </main>
    </div>
  );
};

export default Layout;
