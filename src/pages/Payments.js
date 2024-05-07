import { useEffect, useState, useContext } from "react";

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import PaymentTable from "../components/PaymentTable";
import { supabase } from "../lib/supabase";

export default function Payments() {
    const { client } = useContext(DataContext);
    const [payments, setPayments] = useState([]);

    const paymentsLength = payments?.length === 0;
    const clientID = client?.id

    useEffect(() => {
        async function getPayments() {
            const { data } = await supabase.from("client_payments").select().eq('client_id', clientID);

            if (data?.length > 0) {
                setPayments(data);

            }
        }

        if (clientID && paymentsLength) {
            getPayments()
        }
    }, [clientID, paymentsLength]);

    const listPayments = payments?.map((payment) =>
        <PaymentTable key={payment.id} payment={payment} />
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
                            <th className="px-5 py-3">Status</th>
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