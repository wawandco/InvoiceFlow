import { createContext } from "react"
import { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Stripe from "stripe";
import Loading from "./Loading";
import Login from "./Login";
import { supabase } from "../lib/supabase";
import Signup from "../pages/Signup";

export const DataContext = createContext()
const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY

export default function DataProvider({ children }) {
    const location = useLocation();
    const { pathname } = location;
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [client, setClient] = useState({})

    useEffect(() => {
        async function getSubscriptionStatus() {
            const stripe = Stripe(STRIPE_SECRET_KEY);

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

        async function createClient() {
            var userId = user.sub.replace("auth0|", "")

            const { data, error } = await supabase.from("clients").select().eq('id', userId).single();

            var err = error && error.details !== "The result contains 0 rows"
            if (err) {
                console.log("ERROR getting client: ", error.message)
            }
            if (data != null) {
                setClient(data);
            }

            if (!err && data === null) {
                const { data, error } = await supabase.from('clients')
                    .insert({
                        id: userId,
                        name: user.name,
                        email: user.email,
                        stripe_customer_id: user.stripe_customer_id,
                    }).select().single();

                if (error !== null) {
                    console.log("ERROR creating client: ", error.message)
                } else {
                    setClient(data);
                }
            }
        }

        if (user !== undefined) {
            getSubscriptionStatus();
            createClient();
        }
    }, [user]);

    if (pathname === "/signup") {
        return <Signup />
    }

    if (isLoading) {
        return <Loading />
    }

    if (!isAuthenticated) {
        return <Login />
    }

    return (
        <DataContext.Provider value={{
            user: user,
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            isSubscribed: isSubscribed,
            client: client,
        }}>
            {children}
        </DataContext.Provider>
    )
}