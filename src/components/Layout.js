
import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";

const Layout = ({ questions, loading, error }) => {
  return (
    <div className="app">
      <NavBar />

      <main className="container">
        <Outlet
          context={{ questions, loading, error }}
        />
      </main>
    </div>
  );
};

export default Layout;
