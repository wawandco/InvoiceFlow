import { createContext, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";

import Signup from "../pages/Signup";
import Loading from "../components/Loading";
import Login from "../components/Login";
import { supabase } from "../lib/supabase";

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const location = useLocation();
    const { pathname } = location;
    const { user, isAuthenticated, isLoading } = useAuth0();

    const [currentUser, setCurrentUser] = useState({})
    const [admin, setAdmin] = useState({})
    // const [customer, setCustomer] = useState({})
    // const [usr, setUser] = useState({})
    
    useEffect(() => {
        async function createAdmin() {
            const { data, error } = await supabase.from("admins").select().eq('id', user.id).single();

            var err = error && error.details !== "The result contains 0 rows"
            if (err) {
                console.log("ERROR getting client: ", error.message)
            }
            if (data != null) {
                setAdmin(data);
            }

            if (!err && data === null) {
                const { data, error } = await supabase.from('admins')
                    .insert({
                        id: user.id,
                        full_name: user.name,
                        email: user.email,
                    }).select().single();

                if (error !== null) {
                    console.log("ERROR creating admin: ", error.message)
                } else {
                    setAdmin(data);
                }
            }
        }

        if (user !== undefined && user.role === "Admin") {
            createAdmin();
        }
    }, [user]);

    useEffect(() => {
        const emptyAdmin = Object.keys(admin).length === 0
        // const emptyUser = Object.keys(usr).length === 0
        // const emptyCustomer = Object.keys(customer).length === 0

        if (!emptyAdmin) {
            setCurrentUser({...admin, role: "Admin"});
        } else {
            if (user?.id) {
                setCurrentUser({id: user.id, full_name: user.name, email: user.email})
            }
        }

        // if (!emptyUser) {
        //     setCurrentUser({...usr, role: "User"});
        // }

        // if (!emptyCustomer) {
        //     setCurrentUser({...customer, role: "Customer"});
        // }
    // }, [admin, customer, usr]);
    }, [admin, user]);

    if (!isLoading && !isAuthenticated && pathname === "/signup") {
        return <Signup />
    }

    if (isLoading) {
        return <Loading />
    }

    if (!isAuthenticated) {
        return <Login />
    }

    return (
        <AuthContext.Provider value={{
            isLoading: isLoading,
            isAuthenticated: isAuthenticated,
            user: user,
            currentUser: currentUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}