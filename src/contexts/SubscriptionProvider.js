import { createContext, useEffect, useState, useContext } from "react";
import Stripe from "stripe";

import { AuthContext } from "./AuthProvider";

const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY

export const SubscriptionContext = createContext()

export default function SubscriptionProvider({ children }) {
    const { currentUser } = useContext(AuthContext);
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [productName, setProductName] = useState(false)

    useEffect(() => {
        async function getSubscriptionStatus() {
            const stripe = Stripe(STRIPE_SECRET_KEY);

            const subscriptions = await stripe.subscriptions.list({
                customer: currentUser.stripe_customer_id,
                status: "active",
            })

            if (subscriptions.data.length === 0) {
                setIsSubscribed(false);
            } else {
                const product = await stripe.products.retrieve(subscriptions.data[0].plan.product)
                setProductName(product.name);
                setIsSubscribed(true);
            }
        }

        if (currentUser?.id) {
            getSubscriptionStatus();
        }
    }, [currentUser]);

    // const getSubscriptionInfo = async () => {
    //     const stripe = Stripe(STRIPE_SECRET_KEY);

    //     const subscriptions = await stripe.subscriptions.list({
    //         customer: user.stripe_customer_id,
    //         status: "active",
    //     })

    //     if (subscriptions.data.length > 0) {
    //         const product = await stripe.products.retrieve(subscriptions.data[0].plan.product)

    //         if (Object.keys(customerSubscriptions).length === 0) {
    //             setCustomerSubscriptions({
    //                 subscriptionId: subscriptions.data[0].id,
    //                 productName: product.name,
    //                 amount: subscriptions.data[0].plan.amount / 100,
    //             })
    //         }
    //     }

    // }

    return (
        <SubscriptionContext.Provider value={{
            isSubscribed: isSubscribed,
            productName: productName,
        }}>
            {children}
        </SubscriptionContext.Provider>
    )
}