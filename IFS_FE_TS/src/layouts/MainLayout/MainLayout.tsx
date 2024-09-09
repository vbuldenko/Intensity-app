import { Outlet } from "react-router-dom";

import { useTheme } from "../../contexts/ThemeContext";
import { Header } from "../../components/Layout/Header";
import { Footer } from "../../components/Layout/Footer";
import "./MainLayout.scss";

const MainLayout = () => {
  const { theme } = useTheme();
  return (
    <div className={`app ${theme}`}>
      <Header />

      <main className="container">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
