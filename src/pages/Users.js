import { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import Moment from 'moment';
import emailjs from '@emailjs/browser';

import { SubscriptionContext } from "../contexts/SubscriptionProvider";
import { CompanyContext } from "../contexts/CompanyProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

const auth0ApiKey1 = process.env.REACT_APP_AUTH0_API_KEY1
const auth0ApiKey2 = process.env.REACT_APP_AUTH0_API_KEY2
const auth0ADomain = process.env.REACT_APP_AUTH0_DOMAIN
const USER_ID = process.env.REACT_APP_AUTH0_USER_ROLE_ID

export default function Users() {
    const { companyId } = useContext(CompanyContext);
    const { productName } = useContext(SubscriptionContext);
    const [formData, setFormData] = useState({ full_name: "", email: "" })
    const [users, setUsers] = useState([]);

    const formDataFullName = formData?.full_name === ""

    let maxUser = 2
    if (productName === "Starter") {
        maxUser = 10
    } else if (productName === "Enterprise") {
        maxUser = 100
    }

    useEffect(() => {
        async function getUsers() {
            const { data } = await supabase.from("users").select().eq('company_id', companyId);
            setUsers(data);
        }

        if (companyId && formDataFullName) {
            getUsers();
        }
    }, [companyId, formDataFullName]);

    async function createUser(e) {
        e.preventDefault()

        const { data: user, error } = await supabase.from('users')
            .insert({
                company_id: companyId,
                full_name: formData.full_name,
                email: formData.email
            }).select().single();
        if (error) {
            console.error(`ERROR creating user: ${error.message}`);
        }

        createAuth0User(user, "Qq123456789!");
        notifyUser(user, "Qq123456789!");

        setFormData({ ...formData, full_name: "", email: "" })
    }

    function createAuth0User(user, password) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Authorization", `Bearer ${auth0ApiKey1}${auth0ApiKey2}`);

        var raw = JSON.stringify({
            "email": user.email,
            "user_metadata": { "role_id": USER_ID },
            "blocked": false,
            "email_verified": false,
            "app_metadata": {},
            "given_name": "string",
            "family_name": "string",
            "name": user.full_name,
            "nickname": "string",
            "user_id": user.id,
            "connection": "Username-Password-Authentication",
            "password": password,
            "verify_email": false
        });

        var requestOptions = { method: 'POST', headers: headers, body: raw, redirect: 'follow' };

        fetch(`https://${auth0ADomain}/api/v2/users`, requestOptions).then(response => response.text())
            .then(result => {
                console.log("result: ", result);

                if (JSON.parse(result).error !== undefined && JSON.parse(result).error !== "") {
                    let errorMessage = JSON.parse(result).message.toLowerCase();
                    if (errorMessage.includes(":")) {
                        errorMessage = errorMessage.split(":")[errorMessage.split(":").length - 1].trim();
                    }

                    console.log("ERROR creating user on Auth0 side: ", errorMessage);
                }
            }).catch(error => {
                console.log("ERROR creating user on Auth0 side:: ", error)
            });
    }

    async function notifyUser(user, password) {
        const { data: company } = await supabase.from("companies").select().eq('id', user.company_id).single();
        const link = process.env.REACT_APP_BASE_URL

        var params = {
            from_name: "InvoiceFlow Crew",
            to_email: user.email,
            to_name: user.full_name,
            company_name: company.name,
            receiver_user_name: user.full_nam,
            message1: `You have recently been added to the company ${company.name}, to enter the system, log in by clicking here: ${link}`,
            message2: `email: ${user.email}`,
            message3: `password. ${password}`,
        }

        emailjs.send('if_gmail_service', 'if_welcome_email', params, {
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

    const listUsers = users?.map((user) =>
        <tr key={user.id}>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <Link to={("/user/") + user.id} className="text-black font-bold" target="_blank">{user.full_name}</Link>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">{user.email}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">{Moment(user.created_at).format('MMMM DD, YYYY')}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900">N/A</span>
            </td>
        </tr>
    );

    return (
        <>
            <Dashboard activeTab="users" showSidebar={true}>
                <span className="mb-3">Based on the current plan you have, you are allowed to create {maxUser} users</span>
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <h1 className="font-bold mb-4">New User</h1>

                    <div id='section2' className="p-4 mt-6 lg:mt-0 rounded shadow bg-white">
                        <form onSubmit={createUser}>
                            <div className="flex">
                                <div className="md:flex items-center md:w-1/2 mb-6 mr-4">
                                    <div className="md:w-1/4">
                                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="my-textfield">
                                            Full Name:
                                        </label>
                                    </div>
                                    <div className="md:w-3/4">
                                        <input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                    </div>
                                </div>
                                <div className="md:flex items-center md:w-1/2 mb-6 ml-4">
                                    <div className="md:w-1/4">
                                        <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="my-textfield">
                                            Email:
                                        </label>
                                    </div>
                                    <div className="md:w-3/4">
                                        <input value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                    </div>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className={`${listUsers.length === maxUser ? "pointer-events-none bg-gray-600" : "bg-[#3D52A0] hover:bg-[#3D52A0]/90"} shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`} type="submit">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {listUsers.length > 0 &&
                    <div className="mt-8">
                        <h1 className="font-bold mb-4">Users ({listUsers.length})</h1>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#3d52a0] text-left text-xs font-semibold uppercase tracking-widest text-white">
                                    <th className="px-5 py-3">Full Name</th>
                                    <th className="px-5 py-3">Email</th>
                                    <th className="px-5 py-3">Created at</th>
                                    <th className="px-5 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-500">
                                {listUsers}
                            </tbody>
                        </table>
                    </div>
                }
            </Dashboard>
        </>
    );
}