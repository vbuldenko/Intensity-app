import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AuthRequired from "./components/AuthRequired";

import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import PricesPage from "./pages/Prices/Prices";
import ContactsPage from "./pages/Contacts";
import Schedule from "./components/Schedule";
import LoginPage from "./pages/Login";
import AccountPage from "./pages/Account";

import { useAppDispatch } from "./app/hooks";
import { checkAuth } from "./features/auth/authThunk";
import { NavLinks } from "./types/NavLinks";
import Overview from "./pages/Account/Overview";
import Settings from "./pages/Account/Settings";
import Purchases from "./pages/Account/Purchases";
import UserList from "./pages/Account/UserList";

export default function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, []);
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={NavLinks.Services} element={<ServicesPage />} />
        <Route path={NavLinks.Prices} element={<PricesPage />} />
        <Route path={NavLinks.Contacts} element={<ContactsPage />} />
        <Route path={NavLinks.Schedule} element={<Schedule />} />
        <Route path={NavLinks.Login} element={<LoginPage />} />
        <Route element={<AuthRequired />}>
          <Route path={NavLinks.Account} element={<AccountPage />}>
            <Route index element={<Overview />} />
            <Route path={NavLinks.Settings} element={<Settings />} />
            <Route path={NavLinks.Purchases} element={<Purchases />} />
            <Route
              path={NavLinks.Clients}
              element={<UserList type="client" />}
            />
            <Route path={NavLinks.Team} element={<UserList type="trainer" />} />
          </Route>
        </Route>
        {/* <Route path={NavLinks.SignUp} element={<SignUp />} /> */}

        {/* 
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route element={<AuthProtected />}>
            <Route path="account" element={<Account user={user.data} />}>
              <Route path="trainings" element={<TrainerOverview />} />
              <Route path="clients/:id" element={<Client />} />
              <Route path="team/:id" element={<Trainer />} />
            </Route>
          </Route> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
