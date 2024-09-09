import { Routes, Route } from "react-router-dom";
import MainLayout from "./layouts/MainLayout/MainLayout";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home/Home";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        {/* <Route path="services" element={<Services />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="prices" element={<Prices />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="sign-in" element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route
            path="reset-password/:resetToken"
            element={<ResetPassword />}
          />
          <Route element={<AuthProtected />}>
            <Route path="account" element={<Account user={user.data} />}>
              <Route index element={<Overview user={user.data} />} />
              <Route path="purchases" element={<Purchases />} />
              <Route path="schedule" element={<Schedule />} />
              <Route path="trainings" element={<TrainerOverview />} />
              <Route path="clients" element={<Clients />} />
              <Route path="clients/:id" element={<Client />} />
              <Route path="team" element={<Team />} />
              <Route path="team/:id" element={<Trainer />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route> */}
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
