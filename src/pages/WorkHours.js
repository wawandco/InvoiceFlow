import { useEffect, useState, useContext } from "react";
import { NumericFormat } from 'react-number-format';
import Stripe from "stripe";

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY

export default function WorkHours({ customerId }) {
    const { user, isAuthenticated } = useContext(DataContext);
    const [formData, setFormData] = useState({ userId: "", hours: 0, hourly_price: 0.0 })
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);
    const [usersHours, setUsersHours] = useState([]);

    useEffect(() => {
        var userId = ""
        if (isAuthenticated) {
            userId = user.sub
        }

        setUserId(userId);
    }, [user]);

    useEffect(() => {
        getUsers();
        getUsersWorkHours();
    }, [userId, formData]);

    async function getUsers() {
        if (userId !== "") {
            const { data } = await supabase.from("users").select().eq('auth0_user_id', userId);
            setUsers(data);
        }
    }

    async function getUsersWorkHours() {
        if (userId !== "") {
            const { data } = await supabase.from("users_hours").select().eq('client_id', userId);
            setUsersHours(data);
        }
    }

    async function createUserWorkHours(e) {
        e.preventDefault()

        const { data, error } = await supabase.from('users_hours')
            .insert({
                user_id: formData.userId,
                client_id: userId,
                hours: formData.hours,
                hourly_price: formData.hourly_price,
                month: 4,
                year: 2024
            }).select().single();

        if (error !== null) {
            console.error(`ERROR on work hours INSERT: ${error.message}`);
        }

        createPaymentLink(formData, userId, data.id);

        setFormData({ ...formData, userId: "", hours: 0, hourly_price: 0.0 })
    }

    async function createPaymentLink(formData, userId, userHourId) {
        const stripe = Stripe(STRIPE_SECRET_KEY);

        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'T-shirt',
                        },
                        unit_amount: Math.round((formData.hours * formData.hourly_price) * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${window.location.origin}/successful-payment`,
            cancel_url: `${window.location.origin}/work-hours`,
        });
        console.log("session: ", session);


        const { error } = await supabase.from('clients_payments')
            .insert({
                user_id: formData.userId,
                client_id: userId,
                user_hour_id: userHourId,
                total: (formData.hours * formData.hourly_price),
                link: session.url,
            });

        if (error !== null) {
            console.error(`ERROR on payment INSERT: ${error.message}`);
        }
    }

    async function getUsers() {
        if (userId !== "") {
            const { data } = await supabase.from("users").select().eq('auth0_user_id', userId);
            setUsers(data);
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

    const listUsers = usersHours.map((userHours) =>
        <tr key={userHours.id}>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{userHours.id}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{getUserName(userHours.user_id)}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{userHours.hours}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">$ {userHours.hourly_price}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">
                    $ <NumericFormat value={userHours.hours * userHours.hourly_price} displayType="text" thousandSeparator="," />
                </p>
            </td>
        </tr>
    );

    return (
        <>
            <Dashboard activeTab="workHours">
                <button onClick={createPaymentLink}>Test</button>
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
                                        <select onChange={e => setFormData({ ...formData, userId: e.target.value })}>
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
                                <th className="px-5 py-3">ID</th>
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