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
    if (isAuthenticated && authPaths) {
        return <Navigate to='/' />
    }

    console.log({user});
    console.log({pathname});

    const isAdmin = user?.role === "Admin"
    if (isAdmin) {
        return <Outlet />
    }

    return <Outlet />

    // return isAuthenticated ? <Navigate to='/' /> : <Outlet />
};

// import { useContext } from 'react';
// import { Outlet, Navigate } from 'react-router-dom';

// import { AuthContext } from './AuthProvider';

// export default function ProtectedRoute({ roles }) {
//     const { currentUser, isAuthenticated } = useContext(AuthContext);

//     return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
// };