import { useContext, useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import darkLogo from '../assets/images/logodark.png';
import { AuthContext } from "../contexts/AuthProvider";

const auth0ApiKey1 = process.env.REACT_APP_AUTH0_API_KEY1
const auth0ApiKey2 = process.env.REACT_APP_AUTH0_API_KEY2
const auth0ADomain = process.env.REACT_APP_AUTH0_DOMAIN

export default function Landing() {
    const { logout } = useAuth0();
    const { currentUser, user, isAuthenticated } = useContext(AuthContext);
    const [permissions, setPermissions] = useState([]);

    useEffect(() => {
        if (user?.sub) {
            getUserPermissions(user.sub);
        }
    }, [user]);

    function getUserPermissions(userId) {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Bearer ${auth0ApiKey1}${auth0ApiKey2}`);

        var requestOptions = {
            method: 'GET',
            headers: myHeaders,
            redirect: 'follow'
        };

        fetch(`https://${auth0ADomain}/api/v2/users/${userId}/permissions`, requestOptions)
            .then(response => response.json())
            .then(result => {
                console.log("result: ", result);

                if (result.error !== undefined && result.error !== "") {
                    console.log("ERROR getting user permissions: ", result.message.toLowerCase());
                } else {
                    if (result.length > 0) {
                        setPermissions(result);
                    }
                }
            })
            .catch(error => {
                console.log("error: ", error)
            });
    }

    const listPermissions = permissions?.map((permission) =>
        <p key={permission.permission_name} className='text-black font-bold bg-gray-300 py-1 px-3 rounded-lg my-1'>{permission.permission_name}</p>
    );

    return (
        <>
            <div className="flex items-center justify-between m-3">
                <div>
                    <a href="/" className="flex items-center ms-2 md:me-24">
                        <img src={darkLogo} className="h-8" alt="InvoiceFlow Logo" />
                    </a>
                </div>
                {isAuthenticated &&
                    <div>
                        <a href="/" onClick={logout} className="block data-[focus]:bg-blue-100">
                            Sign Out
                        </a>
                    </div>

                }
            </div>
            <section className="flex flex-col items-center justify-center h-screen mt-[-54px]">
                <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-gray-900">Welcome!</h2>
                <h2 className="mb-4 text-7xl  text-gray-900">{currentUser.full_name}</h2>
                <h2 className="mb-4 text-2xl text-gray-900">{currentUser.email}</h2>

                {user.role === "Admin" &&
                    <>
                        <Link to="/companies" className="text-[#3D52A0] p-2 italic rounded">Companies</Link>
                        <Link to="/pricing" className="text-[#3D52A0] p-2 italic rounded">Go to subscribe</Link>
                    </>
                }

                {user.role === "Customer" &&
                    <>
                        <Link to={("/") + currentUser.company_id + ("/payments")} className="text-[#3D52A0] p-2 italic rounded">Payments</Link>
                    </>
                }

                {permissions.length > 0 &&
                    <>
                        <h1 className='font-bold text-3xl mt-10 mb-3'>Permissions: </h1>
                        {listPermissions}
                    </>
                }
            </section>
        </>
    );
}