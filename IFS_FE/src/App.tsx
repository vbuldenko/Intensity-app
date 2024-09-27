import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import AuthRequired from "./components/AuthRequired";

import NotFound from "./pages/NotFound/NotFound";
import HomePage from "./pages/Home";
import ServicesPage from "./pages/Services";
import PricesPage from "./pages/Prices/Prices";
import ContactsPage from "./pages/Contacts";
import Schedule from "./components/Schedule";
import LoginPage from "./pages/Login";
import AccountPage from "./pages/Account";
import SignUpPage from "./pages/SignUp";
import CheckEmailPage from "./pages/CheckEmail";
import ActivationPage from "./pages/Activation/Activation";

import { useAppDispatch } from "./app/hooks";
import { fetchTrainings } from "./features/trainings/trainingThunk";
import { NavLinks } from "./types/NavLinks";
import Overview from "./pages/Account/Overview";
import Settings from "./pages/Account/Settings";
import Purchases from "./pages/Account/Purchases";
import UserList from "./pages/Account/UserList";
import ScheduleEditor from "./pages/Account/ScheduleEditor";
import { fetchUserData } from "./features/user/userThunk";

export default function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(fetchTrainings());
    dispatch(fetchUserData());
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
        <Route path={NavLinks.SignUp} element={<SignUpPage />} />
        <Route path={NavLinks.CheckEmail} element={<CheckEmailPage />} />
        <Route path={NavLinks.Activate} element={<ActivationPage />} />
        <Route element={<AuthRequired />}>
          <Route path={NavLinks.Account} element={<AccountPage />}>
            <Route index element={<Overview />} />
            <Route path={NavLinks.Settings} element={<Settings />} />
            <Route path={NavLinks.Schedule} element={<Schedule />} />
            <Route path={NavLinks.Purchases} element={<Purchases />} />
            <Route path={NavLinks.Users} element={<UserList />} />
            <Route
              path={NavLinks.ScheduleEditor}
              element={<ScheduleEditor />}
            />
          </Route>
        </Route>
        {/* <Route path={NavLinks.SignUp} element={<SignUp />} /> */}

        {/* 
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
