import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

export default function CompanyInfo() {
    const { company_id } = useParams();
    const [company, setCompany] = useState({});

    useEffect(() => {
        async function getContract() {
            const { data } = await supabase.from("companies").select().eq('id', company_id).single();

            if (data !== null && Object.keys(company).length === 0) {
                setCompany(data);
            }
        }

        getContract();
    });

    return (
        <>
            <Dashboard activeTab="company" showSidebar={true}>
                <h1 className="font-bold">Company Name:</h1>
                <span className="">{company.name}</span>
            </Dashboard>
        </>
    );
};