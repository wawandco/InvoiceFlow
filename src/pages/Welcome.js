import { useContext } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Link } from "react-router-dom";

import darkLogo from '../assets/images/logodark.png';
import { AuthContext } from "../contexts/AuthProvider";

export default function Welcome() {
    const { logout } = useAuth0();
    const { currentUser, user, isAuthenticated } = useContext(AuthContext);

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
                <Link to="/pricing" className="text-[#3D52A0] p-2 italic rounded">Go to subscribe</Link>
            </section>
        </>
    );
}