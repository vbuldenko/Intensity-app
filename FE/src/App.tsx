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
import { Path } from "./types/Path";
import Overview from "./pages/Account/Overview";
import Settings from "./pages/Account/Settings";
import Purchases from "./pages/Account/Purchases";
import UserList from "./pages/Account/UserList";
import ScheduleEditor from "./pages/Account/ScheduleEditor";
import User from "./pages/Account/UserList/User";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AccountActivation from "./pages/Activation/Activation";
import Buying from "./pages/Account/Buying";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path={Path.Services} element={<ServicesPage />} />
        <Route path={Path.Prices} element={<PricesPage />} />
        <Route path={Path.Contacts} element={<ContactsPage />} />
        <Route path={Path.Schedule} element={<Schedule />} />
        <Route path={Path.Login} element={<LoginPage />} />
        <Route path={Path.SignUp} element={<SignUpPage />} />
        <Route path={Path.CheckEmail} element={<CheckEmailPage />} />
        <Route path={Path.Activate} element={<AccountActivation />} />
        <Route path={Path.Restore} element={<ForgotPassword />} />
        <Route path={Path.Reset} element={<ResetPassword />} />
        <Route element={<AuthRequired />}>
          <Route path={Path.Account} element={<AccountPage />}>
            <Route index element={<Overview />} />
            <Route path={Path.Settings} element={<Settings />} />
            <Route path={Path.Schedule} element={<Schedule />} />
            <Route path={Path.Purchases} element={<Purchases />} />
            <Route path={Path.Buying} element={<Buying />} />
            <Route path={Path.Users} element={<UserList />} />
            <Route path={Path.SelectedUser} element={<User />} />
            <Route path={Path.ScheduleEditor} element={<ScheduleEditor />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
