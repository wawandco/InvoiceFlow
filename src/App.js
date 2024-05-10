import { Routes, Route } from 'react-router-dom';

import './App.css';

import DataProviderLayout from './contexts/DataProviderLayout';
import CompanyProviderLayout from './contexts/CompanyProviderLayout';
import Home from './pages/Home';
import Companies from './pages/Companies';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import SuccessfulPayment from './pages/SuccessfulPayment';
import UserWorkHours from './pages/UserWorkHours';
import Users from './pages/Users';
import Payments from './pages/Payments';
import User from './pages/User';
import NotFoundPage from './pages/404';

export default function App() {
  return (
    <Routes>
      <Route element={<DataProviderLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/companies" element={<Companies />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/pricing" element={<Pricing />} />

        <Route element={<CompanyProviderLayout />}>
          <Route path="/:company_id/payments" element={<Payments />} />
          <Route path="/:company_id/users" element={<Users />} />
          <Route path="/:company_id/user/:user_id" element={<User />} />
          <Route path="/:company_id/work-hours" element={<UserWorkHours />} />
        </Route>
      </Route>

      <Route path="/successful-payment" element={<SuccessfulPayment />} />
      <Route path="/404" element={<NotFoundPage />} />
    </Routes>
  );
}