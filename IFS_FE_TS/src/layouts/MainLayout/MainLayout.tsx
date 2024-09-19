import { Outlet, useLocation } from "react-router-dom";

import { useTheme } from "../../contexts/ThemeContext";
import { Header } from "../../components/Layout/Header";
import { Footer } from "../../components/Layout/Footer";
import "./MainLayout.scss";
import { NavLinks } from "../../types/NavLinks";

const MainLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();

  const hideFooterRoutes: string[] = [`/${NavLinks.Account}`];

  // Conditionally render the footer based on the current route
  const shouldHideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div className={`app ${theme}`}>
      <Header />

      <main className="container">
        <Outlet />
      </main>

      {!shouldHideFooter && <Footer />}
    </div>
  );
};

export default MainLayout;
