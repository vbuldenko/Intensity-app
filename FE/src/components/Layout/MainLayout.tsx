import { Outlet, useLocation } from "react-router-dom";

import { useTheme } from "../../contexts/ThemeContext";
import { Header } from "./Header";
import { Footer } from "./Footer";
import "./MainLayout.scss";
import { NavLinks } from "../../types/NavLinks";

const MainLayout = () => {
  const { theme } = useTheme();
  const location = useLocation();

  // const hideFooterRoutes: string[] = [`/${NavLinks.Account}`];
  const hideFooterRoutes: string = `/${NavLinks.Account}`;

  // Conditionally render the footer based on the current route
  // const shouldHideFooter = hideFooterRoutes.includes(location.pathname);
  const shouldHideFooter = location.pathname.startsWith(hideFooterRoutes);

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
