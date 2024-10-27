import { Routes, Route } from "react-router-dom";
import MainLayout from "./components/Layout/MainLayout";
import AuthRequired from "./components/ProtectedRoute";

import NotFound from "./pages/NotFound/NotFound";
import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import PricesPage from "./pages/Prices/Prices";
import ContactsPage from "./pages/Contacts";
import Schedule from "./pages/Schedule";
import LoginPage from "./pages/Login";
import AccountPage from "./pages/Account";
import SignUpPage from "./pages/SignUp";
import CheckEmailPage from "./pages/CheckEmail";
import { NavLinks } from "./types/NavLinks";
import Overview from "./pages/Account/Overview";
import Settings from "./pages/Account/Settings";
import Purchases from "./pages/Account/Purchases";
import UserList from "./pages/Account/UserList";
import ScheduleEditor from "./pages/Account/ScheduleEditor";
import User from "./pages/Account/UserList/User";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountActivation from "./pages/Activation/Activation";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={NavLinks.Services} element={<ServicesPage />} />
        <Route path={NavLinks.Prices} element={<PricesPage />} />
        <Route path={NavLinks.Contacts} element={<ContactsPage />} />
        <Route path={NavLinks.Schedule} element={<Schedule />} />
        <Route path={NavLinks.Login} element={<LoginPage />} />
        <Route path={NavLinks.SignUp} element={<SignUpPage />} />
        <Route path={NavLinks.CheckEmail} element={<CheckEmailPage />} />
        <Route path={NavLinks.Activate} element={<AccountActivation />} />
        <Route path={NavLinks.Restore} element={<ForgotPassword />} />
        <Route path={NavLinks.Reset} element={<ResetPassword />} />
        <Route element={<AuthRequired />}>
          <Route path={NavLinks.Account} element={<AccountPage />}>
            <Route index element={<Overview />} />
            <Route path={NavLinks.Settings} element={<Settings />} />
            <Route path={NavLinks.Schedule} element={<Schedule />} />
            <Route path={NavLinks.Purchases} element={<Purchases />} />
            <Route path={NavLinks.Users} element={<UserList />} />
            <Route path={NavLinks.SelectedUser} element={<User />} />
            <Route
              path={NavLinks.ScheduleEditor}
              element={<ScheduleEditor />}
            />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
