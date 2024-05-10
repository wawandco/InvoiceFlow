import { createContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";

export const CompanyContext = createContext()

export default function CompanyProvider({ children }) {
    const navigate = useNavigate();
    const { company_id } = useParams();
    const [company, setSetCompany] = useState({});

    useEffect(() => {
        getCompany();
    });

    async function getCompany() {
        const { data } = await supabase.from("companies").select().eq('id', company_id).single();

        if (data === null) {
            navigate("/404");
        }

        if (data !== null && Object.keys(company).length === 0) {
            setSetCompany(data);
        }
    }

    return (
        <CompanyContext.Provider value={{ companyId: company_id }}>
            {children}
        </CompanyContext.Provider>
    )
}