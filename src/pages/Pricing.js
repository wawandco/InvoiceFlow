import { useContext } from "react";
import { Navigate } from 'react-router-dom'

import { SubscriptionContext } from "../contexts/SubscriptionProvider";
import PricingTable from "../components/PricingTable";

export default function Pricing() {
  const { isSubscribed } = useContext(SubscriptionContext);

  if (isSubscribed) {
    return <Navigate to="/" />
  }

  return (
    <>
      <PricingTable />
    </>
  );
}
