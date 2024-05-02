import { useEffect, useState, useContext } from "react";
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

export default function Payments() {
    const { client } = useContext(DataContext);
    const [payments, setPayments] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
        getPayments();
    }, [client]);

    async function getUsers() {
        if (client.id !== undefined) {
            const { data } = await supabase.from("users").select().eq('client_id', client.id);
            setUsers(data);
        }
    }

    async function getPayments() {
        if (client.id !== undefined) {
            const { data } = await supabase.from("client_payments").select().eq('client_id', client.id);
            setPayments(data);
        }
    }

    function getUserName(userId) {
        var userName = "N/A"

        users.forEach(function (user) {
            if (user.id === userId) {
                userName = user.full_name
                return
            }
        });

        return userName
    }

    const listPayments = payments.map((payment) =>
        <tr key={payment.id}>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="font-bold text-black">{getUserName(payment.user_id)}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">
                    $ <NumericFormat value={payment.total/100} displayType="text" thousandSeparator="," />
                </p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <Link to={payment.link} className=" bg-green-600 hover:bg-green-400 py-2 px-4 rounded-lg text-white font-bold" target="_blank">Go Pay</Link>
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