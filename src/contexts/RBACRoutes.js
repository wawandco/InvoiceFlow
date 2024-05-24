import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { useAuth0 } from "@auth0/auth0-react";
import Loading from '../components/Loading';

export default function RBACRoutes() {
    const { user, isAuthenticated, isLoading } = useAuth0();
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

    return <Outlet />
};