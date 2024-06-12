import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import Moment from 'moment';
import emailjs from '@emailjs/browser';

import { AuthContext } from "../contexts/AuthProvider";
import { SubscriptionContext } from "../contexts/SubscriptionProvider";
import { CompanyContext } from "../contexts/CompanyProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

const auth0ApiKey1 = process.env.REACT_APP_AUTH0_API_KEY1
const auth0ApiKey2 = process.env.REACT_APP_AUTH0_API_KEY2
const auth0ADomain = process.env.REACT_APP_AUTH0_DOMAIN
const CUSTOMER_ID = process.env.REACT_APP_AUTH0_CUSTOMER_ROLE_ID

export default function Customers() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { productName } = useContext(SubscriptionContext);
    const { companyId } = useContext(CompanyContext);
    const [formData, setFormData] = useState({ full_name: "", email: "" })
    const [customers, setCustomers] = useState([]);

    const formDataFullName = formData?.full_name === ""

    let maxCustomers = 2
    if (productName === "Starter") {
        maxCustomers = 10
    } else if (productName === "Enterprise") {
        maxCustomers = 100
    }

    useEffect(() => {
        if (user?.id && user?.role !== "Admin") {
            console.log("pal carajo");
            navigate("/");
        }
    }, [user, navigate]);

    useEffect(() => {
        async function getCustomers() {
            const { data } = await supabase.from("customers").select().eq('company_id', companyId);
            setCustomers(data);
        }

        if (companyId && formDataFullName) {
            getCustomers();
        }
    }, [companyId, formDataFullName]);

    async function createCustomers(e) {
        e.preventDefault()

        const { data: customer, error } = await supabase.from('customers')
            .insert({
                company_id: companyId,
                full_name: formData.full_name,
                email: formData.email
            }).select().single();
        if (error) {
            console.error(`ERROR creating customer: ${error.message}`);
        }

        createAuth0User(customer, "Qq123456789!");
        notifyCustomers(customer, "Qq123456789!");

        setFormData({ ...formData, full_name: "", email: "" })
    }

    function createAuth0User(customer, password) {
        var headers = new Headers();
        headers.append("Content-Type", "application/json");
        headers.append("Accept", "application/json");
        headers.append("Authorization", `Bearer ${auth0ApiKey1}${auth0ApiKey2}`);

        var raw = JSON.stringify({
            "email": customer.email,
            "user_metadata": { "role_id": CUSTOMER_ID },
            "blocked": false,
            "email_verified": false,
            "app_metadata": {},
            "given_name": customer.full_name,
            "family_name": "N/A",
            "name": customer.full_name,
            "nickname": "N/A",
            "user_id": customer.id,
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

    async function notifyCustomers(customer, password) {
        const { data: company } = await supabase.from("companies").select().eq('id', customer.company_id).single();
        const link = process.env.REACT_APP_BASE_URL

        var params = {
            from_name: "InvoiceFlow Crew",
            to_email: customer.email,
            to_name: customer.full_name,
            company_name: company.name,
            receiver_user_name: customer.full_nam,
            message1: `You have recently been added to the company ${company.name}, to enter the system, log in by clicking here: ${link}`,
            message2: `email: ${customer.email}`,
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

    const listCustomers = customers?.map((customer) =>
        <tr key={customer.id}>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <Link to={("/customer/") + customer.id} className="text-black font-bold" target="_blank">{customer.full_name}</Link>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">{customer.email}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">{Moment(customer.created_at).format('MMMM DD, YYYY')}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900">N/A</span>
            </td>
        </tr>
    );

    return (
        <>
            <Dashboard activeTab="customers" showSidebar={true}>
                <span className="mb-3">Based on the current plan you have, you are allowed to create {maxCustomers} customers</span>
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <h1 className="font-bold mb-4">New Customer</h1>

                    <div id='section2' className="p-4 mt-6 lg:mt-0 rounded shadow bg-white">
                        <form onSubmit={createCustomers}>
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
                                <button className={`${listCustomers.length === maxCustomers ? "pointer-events-none bg-gray-600" : "bg-[#3D52A0] hover:bg-[#3D52A0]/90"} shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`} type="submit">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                {listCustomers.length > 0 &&
                    <div className="mt-8">
                        <h1 className="font-bold mb-4">Customers ({listCustomers.length})</h1>
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
                                {listCustomers}
                            </tbody>
                        </table>
                    </div>
                }
            </Dashboard>
        </>
    );
}