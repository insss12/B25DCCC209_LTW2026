import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({
  questions,
  loading,
  error,
  playerName,
  setPlayerName,
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
          }}
        />
      </main>
    </div>
  );
};

export default Layout;
