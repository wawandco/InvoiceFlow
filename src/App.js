import './App.css';

import { Routes, Route } from 'react-router-dom';
import React, { useState } from 'react';
import Stripe from "stripe";
import { useAuth0 } from "@auth0/auth0-react";

import Home from './pages/Home';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Pricing from './pages/Pricing';
import SuccessfulPayment from './pages/SuccessfulPayment';

export default function App() {
  const STRIPE_SK_KEY = "sk_test_51P6CocDuGS5xH1gVNC6ZqSv0ILh9XhRbtnJXyOTOEHUE48YpEKVKnzVPSr4kC8Xeuy22AZDaVphPRmnTslPTqRaD00izS7Lccg"
  const [isSubscribed, setIsSubscribed] = useState(false)
  const { user } = useAuth0();

  const getSubscriptionStatus = async () => {
    const stripe = Stripe(STRIPE_SK_KEY);

    if (user !== undefined) {
      const subscriptions = await stripe.subscriptions.list({
        customer: user.stripe_customer_id,
        status: "active",
      })

      if (subscriptions.data.length === 0) {
        // console.log("Customer does not have an active subscription");
        setIsSubscribed(false);
      } else {
        // console.log("Customer has an active subscription");
        setIsSubscribed(true);
      }
    }
  }
  
  getSubscriptionStatus();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home isSubscribed={isSubscribed} />} />
        <Route path="/profile" element={<Profile isSubscribed={isSubscribed} />} />
        <Route path="/signup" element={<Signup isSubscribed={isSubscribed}/>} />
        <Route path="/pricing" element={<Pricing isSubscribed={isSubscribed} />} />
        <Route path="/successful-payment" element={<SuccessfulPayment isSubscribed={isSubscribed} />} />
      </Routes>
    </>
  );
}