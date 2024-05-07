import { useEffect, useState, useContext } from "react";
import Stripe from "stripe";
import emailjs from '@emailjs/browser';

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";
import UserWorkHoursTable from "../components/UserWorkHoursTable";

const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY

export default function UserWorkHours() {
    const { client } = useContext(DataContext);
    const [formData, setFormData] = useState({ user_id: "", hours: 0, hourly_price: 0.0 })
    const [users, setUsers] = useState([]);
    const [usersHours, setUsersHours] = useState([]);

    useEffect(() => {
        getUsers();
        getUsersWorkHours();
    }, [client, formData]);

    async function getUsers() {
        if (client.id !== undefined) {
            const { data } = await supabase.from("users").select().eq('client_id', client.id);
            setUsers(data);
        }
    }

    async function getUsersWorkHours() {
        if (client.id !== undefined) {
            const { data } = await supabase.from("user_work_hours").select().eq('client_id', client.id);
            setUsersHours(data);
        }
    }

    async function createUserWorkHours(e) {
        e.preventDefault()

        const { data, error } = await supabase.from('user_work_hours')
            .insert({
                client_id: client.id,
                user_id: formData.user_id,
                hours: formData.hours,
                hourly_price: formData.hourly_price,
                month: 4,
                year: 2024
            }).select().single();

        if (error !== null) {
            console.error(`ERROR creating user work hours: ${error.message}`);
        }

        createPaymentLink(formData, data.id);

        setFormData({ ...formData, user_id: "", hours: 0, hourly_price: 0.0 })
    }

    async function createPaymentLink(formData, userWorkHourId) {
        // const currentDate = new Date();
        const stripe = Stripe(STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            customer: client.stripe_customer_id,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Payment for ${getUserName(formData.user_id)}`,
                        },
                        unit_amount: Math.round((formData.hours * formData.hourly_price) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${window.location.origin}/successful-payment`,
            cancel_url: `${window.location.origin}/work-hours`,
            // expires_at: Math.floor(Date.now() / 1000) + 3200,  // Configured to expire after 30 minutes
        });

        const { data, error } = await supabase.from('client_payments')
            .insert({
                client_id: client.id,
                user_id: formData.user_id,
                user_work_hours_id: userWorkHourId,
                total: Math.round((formData.hours * formData.hourly_price) * 100),
                session_id: session.id,
                link: session.url,
            }).select().single();

        if (error !== null) {
            console.error(`ERROR creating payment: ${error.message}`);
        } else {
            notifyUser(client, data)
        }
    }

    async function notifyUser(client, payment) {
        const { data: uwh } = await supabase.from("user_work_hours").select().eq('id', payment.user_work_hours_id).single();

        var params = {
            from_name: "InvoiceFlow Crew",
            to_email: client.email,
            to_name: client.name,
            receiver_user_name: getUserName(payment.user_id),
            message1: `${uwh.hours} hours of work were invoiced at a price of $ ${uwh.hourly_price} for a total of $ ${payment.total / 100}.`,
            message2: `To make the payment you can do it from our platform: ${process.env.REACT_APP_BASE_URL}`,
            message3:`or by clicking the following link: ${payment.link}`,
        }

        emailjs.send('service_7c1ouhn', 'template_kqngkyt', params, {
            publicKey: process.env.REACT_APP_EMAILJS_PUBLIC_KEY,
        }).then(
            () => {
                console.log('SUCCESS!');
            },
            (error) => {
                console.log('FAILED...', error);
            },
        );
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

    const listUsers = usersHours.map((uwk) =>
        <UserWorkHoursTable key={uwk.id} uwk={uwk} />
    );

    return (
        <>
            <Dashboard activeTab="workHours">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <h1 className="font-bold mb-4">Create User</h1>

                    <div id='section2' className="p-4 mt-6 lg:mt-0 rounded shadow bg-white">
                        <form onSubmit={createUserWorkHours} className="flex flex-col">
                            <div className="flex justify-between it mb-3">
                                <div className="flex items-center w-full mr-3">
                                    <div className="w-2/5">
                                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="my-textfield">
                                            User:
                                        </label>
                                    </div>
                                    <div className="w-3/5">
                                        <select onChange={e => setFormData({ ...formData, user_id: e.target.value })}>
                                            <option value="" > Select a user </option>
                                            {users.map(user => (
                                                <option key={user.id} value={user.id} > {user.full_name} </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center w-full mr-3">
                                    <div className="w-2/5">
                                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="my-textfield">
                                            Hours:
                                        </label>
                                    </div>
                                    <div className="w-3/5">
                                        <input value={formData.hours} onChange={(e) => setFormData({ ...formData, hours: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                    </div>
                                </div>
                                <div className="flex items-center w-full">
                                    <div className="w-2/5">
                                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="my-textfield">
                                            Hourly Price:
                                        </label>
                                    </div>
                                    <div className="w-3/5">
                                        <input value={formData.hourly_price} onChange={(e) => setFormData({ ...formData, hourly_price: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="shadow bg-yellow-700 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-8">
                    <h1 className="font-bold mb-4">Users</h1>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#3d52a0] text-left text-xs font-semibold uppercase tracking-widest text-white">
                                {/* <th className="px-5 py-3">ID</th> */}
                                <th className="px-5 py-3">User</th>
                                <th className="px-5 py-3">Hours</th>
                                <th className="px-5 py-3">Price</th>
                                <th className="px-5 py-3">Total</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-500">
                            {listUsers}
                        </tbody>
                    </table>
                </div>
            </Dashboard>
        </>
    );
}