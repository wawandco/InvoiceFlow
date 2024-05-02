import { createContext } from "react"
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Stripe from "stripe";
import Loading from "./Loading";
import Login from "./Login";

export const DataContext = createContext()
const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY

export default function DataProvider({ children }) {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [isSubscribed, setIsSubscribed] = useState(false)

    useEffect(() => {
        getSubscriptionStatus();
    }, [user]);

    const getSubscriptionStatus = async () => {
        const stripe = Stripe(STRIPE_SECRET_KEY);

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

    if (isLoading) {
        return <Loading/>
    }

    if (!isAuthenticated) {
        return <Login/>
    }

    return (
        <DataContext.Provider value={{
            user: user,
            isAuthenticated: isAuthenticated,
            isLoading: isLoading,
            isSubscribed: isSubscribed,
        }}>
            {children}
        </DataContext.Provider>
    )
}