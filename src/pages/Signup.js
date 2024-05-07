import { useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";

import darkLogo from '../assets/images/logodark.png';

const auth0ApiKey = process.env.REACT_APP_AUTH0_API_KEY
const auth0ADomain = process.env.REACT_APP_AUTH0_DOMAIN

const Signup = () => {
    const { loginWithRedirect } = useAuth0();
    const [formData, setFormData] = useState({ fullName: "", email: "", password: "" })
    const [error, setError] = useState(false)

    const handleSubmit = (e) => {
        e.preventDefault()

        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${auth0ApiKey}`);

        var raw = JSON.stringify({
            "email": formData.email,
            "user_metadata": {},
            "blocked": false,
            "email_verified": false,
            "app_metadata": {},
            "given_name": "string",
            "family_name": "string",
            "name": formData.fullName,
            "nickname": "string",
            "user_id": crypto.randomUUID(),
            "connection": "Username-Password-Authentication",
            "password": formData.password,
            "verify_email": false
        });

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://${auth0ADomain}/api/v2/users`, requestOptions)
            .then(response => response.text())
            .then(result => {
                console.log("result: ", result);

                if (JSON.parse(result).error !== undefined && JSON.parse(result).error !== "") {
                    setError(true)
                } else {
                    loginWithRedirect();
                }
            })
            .catch(error => {
                console.log("error: ", error)
            });
    }

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm flex flex-col items-center">
                <img src={darkLogo} className="h-8 me-3" alt="InvoiceFlow Logo" width={150} />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register an Account</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm border p-4 rounded bg-gray-50 shadow-md">
                {error &&
                    <p className='text-red-600 text-center text-sm mb-3'>Error creating your account, please try again.</p>
                }
                <form className="space-y-6" action="#" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="fullName" className="block text-sm font-medium leading-6 text-gray-900">Full Name</label>
                        <div className="mt-2">
                            <input id="fullName" name="fullName" type="text" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email</label>
                        <div className="mt-2">
                            <input id="email" name="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                        <div className="mt-2">
                            <input id="password" name="password" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-[#3D52A0] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#3D52A0]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3D52A0]/80">Sign Up</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;