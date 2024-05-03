import './App.css';

import { Routes, Route } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import SuccessfulPayment from './pages/SuccessfulPayment';
import WorkHours from './pages/WorkHours';
import Users from './pages/Users';
import Payments from './pages/Payments';
import DataProvider from './components/DataProvider';
import User from './pages/User';

export default function App() {
  const { user } = useAuth0();

  return (
    <DataProvider>
      <Routes>
        <Route path="/" element={<Home/>} />
        <Route path="/users" element={<Users/>} />
        <Route path="/user/:user_id" element={<User/>} />
        <Route path="/work-hours" element={<WorkHours customerId={user && user.stripe_customer_id} />} />
        <Route path="/payments" element={<Payments/>} />
        <Route path="/profile" element={<Profile/>} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/pricing" element={<Pricing/>} />
        <Route path="/successful-payment" element={<SuccessfulPayment />} />
      </Routes>
    </DataProvider>
  );
}