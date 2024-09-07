import { Outlet } from "react-router-dom";

import Footer from "../components/Layout/Footer";
import { useTheme } from "../contexts/ThemeContext";
import { Header } from "../components/Layout/Header";

const MainLayout = () => {
  const { theme } = useTheme();
  return (
    <div className={`App ${theme}`}>
      <Header />

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
