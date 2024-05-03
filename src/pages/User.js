import { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";

import Dashboard from "../components/Dashboard";

export default function User() {
    const { user_id } = useParams();
    const [user, setUser] = useState({});

    useEffect(() => {
        getUser();
    });

    async function getUser() {
        const { data } = await supabase.from("users").select().eq('id', user_id).single();
        setUser(data);
    }

    return (
        <>
            <Dashboard activeTab="user">
                <h1 className="font-bold">{user.full_name}</h1>
            </Dashboard>
        </>
    );
}