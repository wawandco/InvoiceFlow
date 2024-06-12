import { createContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { supabase } from "../lib/supabase";

export const CompanyContext = createContext()

export default function CompanyProvider({ children }) {
    const navigate = useNavigate();
    const { company_id } = useParams();
    const [company, setCompany] = useState({});

    useEffect(() => {
        async function getCompany() {
            const { data } = await supabase.from("companies").select().eq('id', company_id).single();

            if (data === null) {
                navigate("/404");
            } else {
                setCompany(data);
            }
        }

        if (Object.keys(company).length === 0) {
            getCompany();
        }
    });

    return (
        <CompanyContext.Provider value={{
            companyId: company_id,
            company: company,
        }}>
            {children}
        </CompanyContext.Provider>
    )
}