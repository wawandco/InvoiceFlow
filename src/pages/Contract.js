import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";
import ContractDocument from "../components/ContractDocument";

export default function Contract() {
    const { contract_id } = useParams();
    const [contract, setContract] = useState({});

    useEffect(() => {
        getContract();
    });

    async function getContract() {
        const { data } = await supabase.from("contracts").select().eq('id', contract_id).single();

        if (data !== null && Object.keys(contract).length === 0) {
            setContract(data);
        }
    }

    return (
        <>
            <Dashboard activeTab="contracts" showSidebar={true}>
                <ContractDocument contract={contract} />
            </Dashboard>
        </>
    );
}