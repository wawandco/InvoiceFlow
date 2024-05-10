import { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import Stripe from "stripe";
import { NumericFormat } from 'react-number-format';

import { CompanyContext } from "../contexts/CompanyProvider";
import { supabase } from "../lib/supabase";

const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY

export default function PaymentTable({ payment }) {
    const { companyId } = useContext(CompanyContext);
    const [session, setSession] = useState({});
    const [user, setUser] = useState({});

    useEffect(() => {
        async function getSession() {
            const stripe = Stripe(STRIPE_SECRET_KEY);
            const session = await stripe.checkout.sessions.retrieve(payment.session_id);
            setSession(session);
        }

        async function getUser() {
            const { data } = await supabase.from("users").select().eq('id', payment.user_id).single();
            setUser(data);
        }

        getSession();
        getUser();
    }, [payment]);

    let status = session.status
    switch (session.status) {
        case "complete":
            status = "completed"
            break;
        case "open":
            status = "pending"
            break;
        case "expired":
            status = "expired"
            break;
        default:
            status = "N/A"
            break;
    }

    return (
        <>
            <tr key={payment.id}>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <Link to={("/") + companyId + ("/user/") + payment.user_id} className="text-black font-bold" target="_blank">{user.full_name}</Link>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="text-black">
                        $ <NumericFormat value={payment.total / 100} displayType="text" thousandSeparator="," />
                    </p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <Link to={session.status === "open" ? payment.link : "#"} className={`${session.status !== "open" ? "pointer-events-none bg-gray-600" : "bg-green-600 hover:bg-green-400"} py-2 px-4 rounded-lg text-white font-bold`} target="_blank">Go Pay</Link>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${session.status === "open" ? "text-blue-900 bg-blue-200" : ""} ${session.status === "complete" ? "text-green-900 bg-green-200" : ""} ${session.status === "expired" ? "text-gray-900 bg-gray-200" : ""}`}>{status}</span>
                </td>
            </tr>
        </>
    );
}