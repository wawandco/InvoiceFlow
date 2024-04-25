import { useAuth0 } from "@auth0/auth0-react";

import Loading from '../components/Loading';
import Dashbboard from "../components/Dashboard";
import Login from "../components/Login";
import PricingTable from "../components/PricingTable";

import  { Navigate } from 'react-router-dom'

export default function Billing({ isSubscribed }) {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isSubscribed) {
    return <Navigate to="/"  />
  }

  if (isLoading) {
    return <Loading></Loading>
  }

  if (!isAuthenticated) {
    return <Login></Login>
  }

  return (
    <>
      <Dashbboard isAuthenticated={isAuthenticated} activeTab="billing" isSubscribed={isSubscribed} >
          <PricingTable customerId={user.stripe_customer_id} />
      </Dashbboard>
    </>
  );
}
