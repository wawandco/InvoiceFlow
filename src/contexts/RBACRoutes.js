import { useState } from "react";
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { supabase } from "../lib/supabase";

import { useAuth0 } from "@auth0/auth0-react";
import Loading from '../components/Loading';

export default function RBACRoutes() {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [customer, setCustomer] = useState({})
    const location = useLocation();
    const { pathname } = location;

    if (isLoading) {
        return <Loading />
    }

    const authPaths = pathname === "/login" || pathname === "/signup"
    if (!isAuthenticated && !authPaths) {
        return <Navigate to='/login' />
    }
    if (isAuthenticated && authPaths) {
        return <Navigate to='/' />
    }

    const isAdmin = user?.role === "Admin"
    if (isAdmin) {
        return <Outlet />
    }

    const isCustomer = user?.role === "Customer"
    const customerUnavailablesPaths = pathname === "/companies" || pathname === "/pricing"
    if (isCustomer && customerUnavailablesPaths) {
        return <Navigate to='/' />
    }

    if (isCustomer && pathname === "/") {
        async function getCustomer(id) {
            const { data } = await supabase.from("customers").select().eq('id', id).single();

            if (data !== null && Object.keys(customer).length === 0) {
                setCustomer(data);
            }
        }
        getCustomer(user.id)

        if (customer?.company_id) {
            return <Navigate to={("/") + customer?.company_id + ("/payments")} />
        } else {
            return <Loading />
        }
    }

    return <Outlet />
};