import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

export default function Customer() {
    const { customer_id } = useParams();
    const [customer, setCustomer] = useState({});

    useEffect(() => {
        getCustomer();
    });

    async function getCustomer() {
        const { data } = await supabase.from("customers").select().eq('id', customer_id).single();
        setCustomer(data);
    }

    return (
        <>
            <Dashboard activeTab="customer" showSidebar={true}>
                <h1 className="font-bold">{customer.full_name}</h1>
            </Dashboard>
        </>
    );
}