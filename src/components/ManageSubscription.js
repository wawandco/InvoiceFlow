import Stripe from "stripe";
import React, { useState } from 'react';

export default function ManageSubscription({ isSubscribed, customerId }) {
    const STRIPE_SK_KEY = "sk_test_51P6CocDuGS5xH1gVNC6ZqSv0ILh9XhRbtnJXyOTOEHUE48YpEKVKnzVPSr4kC8Xeuy22AZDaVphPRmnTslPTqRaD00izS7Lccg"
    const [customerSubscriptions, setCustomerSubscriptions] = useState({})

    const handleManageSubscription = async () => {
        const stripe = Stripe(STRIPE_SK_KEY);

        const session = await stripe.billingPortal.sessions.create({
            customer: customerId,
            return_url: `${window.location.origin}/profile`,
        });
        window.location.href = session.url
    }

    const getSubscriptionInfo = async () => {
        const stripe = Stripe(STRIPE_SK_KEY);

        const subscriptions = await stripe.subscriptions.list({
            customer: customerId,
            status: "active",
        })

        if (subscriptions.data.length > 0) {
            const product = await stripe.products.retrieve(subscriptions.data[0].plan.product)

            if (Object.keys(customerSubscriptions).length === 0) {
                setCustomerSubscriptions({
                    subscriptionId: subscriptions.data[0].id,
                    productName: product.name,
                    amount: subscriptions.data[0].plan.amount / 100,
                })
            }
        }

    }
    getSubscriptionInfo();

    return (
        <>
            {isSubscribed &&
                <div className="flex flex-col justify-center max-w-lg m-4 p-6 shadow-md rounded-xl sm:px-12 dark:bg-gray-50 dark:text-gray-800">
                    <div className="space-y-4 text-center">
                        <h2 className="text-xl font-semibold sm:text-2xl">{customerSubscriptions.productName}</h2>
                        <p className="px-5 text-4xl">$ {customerSubscriptions.amount}</p>
                        <div className="my-2 space-y-1">
                            <button onClick={handleManageSubscription} className="text-white bg-[#3D52A0] text-lg rounded-lg px-5 py-2.5">
                                Manage Subscription
                            </button>
                        </div>
                    </div>
                </div>
            }
        </>
    );
};