import { Routes, Route } from 'react-router-dom';

import './App.css';

import DataProviderLayout from './contexts/DataProviderLayout';
import CompanyProviderLayout from './contexts/CompanyProviderLayout';
import Companies from './pages/Companies';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import SuccessfulPayment from './pages/SuccessfulPayment';
import UserWorkHours from './pages/UserWorkHours';
import Users from './pages/Users';
import Payments from './pages/Payments';
import User from './pages/User';
import NotFoundPage from './pages/404';
import Login from './pages/Login';
import Landing from './pages/Landing';
import RBACRoutes from './contexts/RBACRoutes';

export default function App() {
  return (
    <Routes>
      <Route element={<RBACRoutes />}>
        <Route element={<DataProviderLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/companies" element={<Companies />} />
          <Route path="/pricing" element={<Pricing />} />

          <Route element={<CompanyProviderLayout />}>
            <Route path="/:company_id/payments" element={<Payments />} />
            <Route path="/:company_id/users" element={<Users />} />
            <Route path="/:company_id/user/:user_id" element={<User />} />
            <Route path="/:company_id/work-hours" element={<UserWorkHours />} />
          </Route>
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/successful-payment" element={<SuccessfulPayment />} />
      </Route>

      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
}