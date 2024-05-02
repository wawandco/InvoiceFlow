import { useState, useContext } from 'react';
import Stripe from "stripe";
import { loadStripe } from "@stripe/stripe-js";
import { DataContext } from "../components/DataProvider";

const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY

export default function PricingTable() {
    const { user } = useContext(DataContext);
    const [products, setProducts] = useState([])
    // const [cusSession, setCusSession] = useState({})

    // const createCustomerSession = async () => {
    //     const stripe = Stripe(STRIPE_SK_KEY);

    //     const customerSession = await stripe.customerSessions.create({
    //         customer: customerId,
    //         components: {
    //             pricing_table: {
    //                 enabled: true,
    //             },
    //         },
    //     });

    //     if (Object.keys(cusSession).length === 0) {
    //         setCusSession(customerSession)
    //     }
    // }
    // createCustomerSession();

    const handleCheckout = async (priceId) => {
        const stripeSk = Stripe(STRIPE_SECRET_KEY);
        const stripePk = await loadStripe(STRIPE_PUBLISHABLE_KEY);

        const session = await stripeSk.checkout.sessions.create({
            customer: user.stripe_customer_id,
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
            console.warn("Error: ", error);
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
    // products.forEach(async (product) => { console.log("Product: ", product)});

    return (
        <>
            {/* <stripe-pricing-table
                pricing-table-id="prctbl_1P9SxSDuGS5xH1gVv3yCn5NA"
                publishable-key="pk_test_51P6CocDuGS5xH1gVlXTr0Zyg5yqu5X2bWoH4aTRXGU1VeCTZ078UuFx0eQgYQDlRi7vgR8PE0n6m4AIdvmZjelX200jAwyHr7L"
                customer-session-client-secret={cusSession.client_secret}
            >
            </stripe-pricing-table> */}

            <section className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
                <div className="mx-auto max-w-screen-md text-center mb-8 lg:mb-12">
                    <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">Choose your Plan</h2>
                </div>
                <div className="space-y-8 lg:grid lg:grid-cols-3 sm:gap-6 xl:gap-10 lg:space-y-0">
                    {products.map(product => (
                        <div key={product.id} className="flex flex-col p-6 mx-auto text-center rounded-lg border border-gray-100 shadow">
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