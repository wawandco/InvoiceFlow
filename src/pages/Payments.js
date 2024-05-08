import { useEffect, useState, useContext } from "react";

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import PaymentTable from "../components/PaymentTable";
import { supabase } from "../lib/supabase";
import { Link } from "react-router-dom";

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
                {listPayments.length > 0 ?
                    <>
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
                    </>
                    :
                    <div className="h-screen flex flex-col items-center justify-center mt-[-88px]">
                        <span className="font-bold text-lg">No payments available yet</span>
                        <span className="mb-3">You must create work hours for a user</span>
                        <Link to="/work-hours" className="bg-[#3D52A0] p-2 text-white rounded">Add user work hours</Link>
                    </div>
                }
            </Dashboard>
        </>
    );
}