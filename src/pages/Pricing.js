import { useState, useContext } from 'react';
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { useAuth0 } from "@auth0/auth0-react";

import { AuthContext } from "../contexts/AuthProvider";
import { supabase } from "../lib/supabase";

const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

export default function Pricing() {
  const { logout } = useAuth0();
  const { currentUser, user, isAuthenticated } = useContext(AuthContext);
  const [products, setProducts] = useState([])

  const handleCheckout = async (priceId) => {
    const stripeSk = Stripe(STRIPE_SECRET_KEY);
    const stripePk = await loadStripe(STRIPE_PUBLISHABLE_KEY);
    let customerId = currentUser.stripe_customer_id

    if (customerId === "" || customerId === null) {
      const customer = await stripeSk.customers.create({
        name: user.name,
        email: user.email,
      });
      customerId = customer.id

      const { err } = await supabase.from('admins')
        .update({ stripe_customer_id: customer.id }).eq('id', currentUser.id)
      if (err) {
        console.error(`ERROR updating admin: ${err.message}`);
      }
    }

    const session = await stripeSk.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        { price: priceId, quantity: 1 },
      ],
      mode: 'subscription',
      success_url: `${window.location.origin}/successful-payment`,
      cancel_url: `${window.location.origin}/pricing`,
    });

    const { error } = await stripePk.redirectToCheckout({ sessionId: session.id })
    if (error) {
      console.warn("Error redirectToCheckout: ", error);
    }
  }

  const getPrices = async () => {
    const stripe = Stripe(STRIPE_SECRET_KEY);
    const prices = await stripe.prices.list();

    var p = []

    for (const price of prices.data) {
      if (price.active) {
        const product = await stripe.products.retrieve(price.product)

        p.push({
          id: product.id,
          name: product.name,
          description: product.metadata.description,
          priceId: price.id,
          amount: price.unit_amount / 100,
          interval: price.recurring.interval,
        })
      }
    }

    if (products.length === 0) {
      setProducts(p)
    }
  }
  getPrices();

  return (
    <>
      {isAuthenticated &&
        <div className='flex items-center justify-end mt-3 mr-4'>
          <a href="/" onClick={logout} className="block data-[focus]:bg-blue-100">
            Sign out
          </a>
        </div>
      }
      <section className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">Choose your Plan</h2>
        </div>
        <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
          {products.map(product => (
            <div key={product.id} className="flex flex-col justify-between p-6 mx-auto text-center rounded-lg border border-gray-100 shadow">
              <h3 className="mb-4 text-2xl font-semibold">{product.name}</h3>
              <p className="font-light text-gray-500 sm:text-lg">{product.description}</p>
              <div className="flex justify-center items-baseline my-8">
                <span className="mr-2 text-5xl font-extrabold">$ {product.amount}</span>
                <span className="text-gray-500 dark:text-gray-400">/month</span>
              </div>
              <button onClick={() => { handleCheckout(product.priceId) }} className="text-white bg-[#3D52A0] text-lg rounded-lg px-5 py-2.5">Subscribe</button>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};