import { useAuth0 } from "@auth0/auth0-react";
import { supabase } from "../lib/supabase";
import { createContext, useEffect, useState } from "react";;

export const AuthContext = createContext()

export default function AuthProvider({ children }) {
    const { user, isAuthenticated, isLoading } = useAuth0();
    const [currentUser, setCurrentUser] = useState({})
    const [admin, setAdmin] = useState({})
    const [customer, setCustomer] = useState({})

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
        const emptyCustomer = Object.keys(customer).length === 0

        async function getCustomer(id) {
            const { data } = await supabase.from("customers").select().eq('id', id).single();
            setCustomer(data);
        }

        if (emptyCustomer && user?.id && user?.role === "Customer") {
            getCustomer(user.id)
        }

        if (!emptyAdmin) {
            setCurrentUser({ ...admin, role: "Admin" });
        } else if (!emptyCustomer) {
            setCurrentUser({ ...customer, role: "Customer" });
        } else {
            if (user?.id) {
                setCurrentUser({ id: user.id, full_name: user.name, email: user.email })
            }
        }
    }, [admin, customer, user]);

    return (
        <AuthContext.Provider value={{
            isLoading,
            isAuthenticated,
            user,
            currentUser,
        }}>
            {children}
        </AuthContext.Provider>
    )
}