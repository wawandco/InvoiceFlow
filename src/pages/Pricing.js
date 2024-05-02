import { useContext } from "react";
import  { Navigate } from 'react-router-dom'

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import PricingTable from "../components/PricingTable";

export default function Pricing() {
  const { isSubscribed } = useContext(DataContext);

  if (isSubscribed) {
    return <Navigate to="/"  />
  }

  return (
    <>
      <Dashboard activeTab="pricing">
          <PricingTable/>
      </Dashboard>
    </>
  );
}
