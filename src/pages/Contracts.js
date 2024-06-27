import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Moment from 'moment';

import { PDFDownloadLink } from '@react-pdf/renderer';

import { AuthContext } from "../contexts/AuthProvider";
import { CompanyContext } from "../contexts/CompanyProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";
import ContractRow from "../components/ContractRow";

export default function Contracts() {
    const { currentUser } = useContext(AuthContext);
    const { companyId } = useContext(CompanyContext);
    const [contracts, setContracts] = useState([]);

    const contractsLength = contracts?.length === 0;

    useEffect(() => {
        async function getContracts() {
            const { data } = await supabase.from("contracts").select().eq('company_id', companyId);

            if (data?.length > 0) {
                setContracts(data);

            }
        }

        if (companyId && contractsLength) {
            getContracts()
        }
    }, [companyId, contractsLength]);


    const contractsList = contracts?.map((contract) =>
        <ContractRow key={contract.id} contract={contract} />
    );

    return (
        <>
            <Dashboard activeTab="contracts" showSidebar={true}>
                {contractsList.length > 0 ?
                    <>
                        <div className="flex items-center justify-between py-3">
                            <h1 className="font-bold">Contracts ({ contractsList.length })</h1>
                            {currentUser?.role === "Admin" &&
                                <Link to={("/") + companyId + ("/contracts/new")} className="text-white bg-[#3D52A0] px-4 py-1 rounded" > New </Link>
                            }
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-[#3d52a0] text-left text-xs font-semibold uppercase tracking-widest text-white">
                                    <th className="px-5 py-3">Customer</th>
                                    <th className="px-5 py-3">Type</th>
                                    <th className="px-5 py-3">Created At</th>
                                    <th className="px-5 py-3">Cost</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3">PDF</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-500">
                                {contractsList}
                            </tbody>
                        </table>
                    </>
                    :
                    <div className="h-screen flex flex-col items-center justify-center mt-[-88px]">
                        <span className="font-bold text-lg">No contracts available yet</span>

                        {currentUser?.role === "Admin" &&
                            <Link to={("/") + companyId + ("/contracts/new")} className="bg-[#3D52A0] p-2 text-white rounded mt-3" > New Contract </Link>
                        }
                    </div>
                }
            </Dashboard>
        </>
    );
}