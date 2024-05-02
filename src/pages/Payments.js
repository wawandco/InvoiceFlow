import { useEffect, useState, useContext } from "react";
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

export default function Payments() {
    const { user, isAuthenticated } = useContext(DataContext);
    const [userId, setUserId] = useState("");
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        var uId = ""
        if (isAuthenticated) {
            uId = user.sub
        }

        setUserId(uId);
    }, [user]);

    useEffect(() => {
        getPayments();
    }, [userId]);

    async function getPayments() {
        if (userId != "") {
            const { data: client, error } = await supabase.from("clients").select().eq('auth0_user_id', userId).single();

            if (error == null) {
                const { data: clientPayments } = await supabase.from("clients_payments").select().eq('client_id', userId);
                setPayments(clientPayments);
            }
        }
    }

    function getUserName(userId) {
        // supabase.from("users").select().eq('id', userId).single().then((response) => {
        //     console.log(response.data[0].full_name);
        //     if (response.data.length > 0) {
        //         return response.data[0].full_name
        //     }
        // })
        return "In Progress ... " + userId
    }

    console.log("PAYMENTS", payments);

    const listPayments = payments.map((payment) =>
        <tr key={payment.id}>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{getUserName(payment.user_id)}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">
                    $ <NumericFormat value={payment.total} displayType="text" thousandSeparator="," />
                </p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <Link to={payment.link} target="_blank">Pay</Link>
            </td>
        </tr>
    );

    return (
        <>
            <Dashboard activeTab="payments">
                <h1 className="font-bold mb-4">Payments</h1>

                <table className="w-full">
                    <thead>
                        <tr className="bg-[#3d52a0] text-left text-xs font-semibold uppercase tracking-widest text-white">
                            <th className="px-5 py-3">User</th>
                            <th className="px-5 py-3">Total</th>
                            <th className="px-5 py-3">Link</th>
                        </tr>
                    </thead>
                    <tbody className="text-gray-500">
                        {listPayments}
                    </tbody>
                </table>
            </Dashboard>
        </>
    );
}