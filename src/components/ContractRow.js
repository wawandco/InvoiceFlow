import { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { NumericFormat } from 'react-number-format';
import Moment from 'moment';

import { CompanyContext } from "../contexts/CompanyProvider";
import { supabase } from "../lib/supabase";

export default function ContractRow({ contract }) {
    const { companyId } = useContext(CompanyContext);
    const [customer, setCustomer] = useState({});

    useEffect(() => {
        async function getCustomer() {
            const { data } = await supabase.from("customers").select().eq('id', contract.customer_id).single();

            if (data !== null && Object.keys(customer).length === 0) {
                setCustomer(data);
            }
        }

        getCustomer();
    }, [contract]);

    let contractType = ""
    let contractCost = 0.0
    switch (contract.contract_type) {
        case "feature":
            contractType = "Featrue Based"
            contractCost = contract.feature_cost
            break;
        case "hours":
            var start = Moment(contract.start_date);
            var end = Moment(contract.end_date);
            let diff = end.diff(start, "days") + 1

            contractType = "Work Hours Based"
            contractCost = contract.resources_number * (contract.daily_hours * contract.hourly_price) * diff
            break;
        default:
            contractType = "N/A"
            contractCost = 0.0
            break;
    }

    return (
        <>
            <tr key={contract.id}>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="text-black">{customer.full_name}</p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="text-black">{contractType}</p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="text-black">{Moment(contract.created_at).format('MMMM DD, YYYY')}</p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm text-black">
                    $ <NumericFormat value={contractCost} displayType="text" thousandSeparator="," />
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${(contract.status === "company_signature_pending" || contract.status === "customer_signature_pending") ? "text-blue-900 bg-blue-200" : ""} ${contract.status === "completed" ? "text-green-900 bg-green-200" : ""} ${contract.status === "pending_signatures" ? "text-gray-900 bg-gray-200" : ""}`}>{contract.status}</span>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <Link to={("/") + companyId + ("/contracts/") + contract.id} className="text-black font-bold" target="_blank"> See Document</Link>

                    {/* <PDFDownloadLink document={<ContractDocument contract={contract} />} fileName="contract.pdf">
                    {({ blob, url, loading, error }) =>
                        loading ? 'Loading ...' : 'Download!'
                    }
                </PDFDownloadLink> */}
                </td>
            </tr>
        </>
    );
}