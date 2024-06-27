import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { CompanyContext } from "../contexts/CompanyProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase";

const CONTRACT_TYPE = [
    { type: "feature", description: "Feature Based" },
    { type: "hours", description: "Work Hours Based" },
]

export default function NewContract() {
    const navigate = useNavigate();
    const { companyId } = useContext(CompanyContext);
    const [customers, setCustomers] = useState([])
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        customerId: "",
        contractType: "feature",
        resourcesNumber: 0,
        startDate: "",
        endDate: "",
        featureTitle: "",
        featureCost: 0.0,
        featureDescription: "",
        dailyHours: 0,
        hourlyPrice: 0.0,
    })

    useEffect(() => {
        async function getCustomers() {
            const { data } = await supabase.from("customers").select().eq('company_id', companyId);
            setCustomers(data);
        }

        if (companyId) {
            getCustomers();
        }
    }, [companyId]);

    async function createContract(e) {
        e.preventDefault()

        if (formData.customerId === "") {
            setError("A customer must be selected in order to create a contract.")
            return
        }

        const { error } = await supabase.from('contracts').insert({
            customer_id: formData.customerId,
            company_id: companyId,
            contract_type: formData.contractType,
            status: "pending_signatures",
            resources_number: formData.resourcesNumber,
            start_date: formData.startDate,
            end_date: formData.endDate,
            feature_title: formData.featureTitle,
            feature_cost: formData.featureCost,
            feature_description: formData.featureDescription,
            daily_hours: formData.dailyHours,
            hourly_price: formData.hourlyPrice,
        }).select().single();

        if (error) {
            console.error(`ERROR creating contract: ${error.message}`);
            setError(error.message);
        }else {
            navigate("/" + companyId + "/contracts");
        }
    }

    return (
        <>
            <Dashboard activeTab="contracts" showSidebar={true}>
                {error !== "" &&
                    <span className="text-red-600 text-sm">{error}</span>
                }
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <h1 className="font-bold mb-4">New Contract</h1>

                    <div id='section2' className="p-4 mt-6 lg:mt-0 rounded shadow bg-white">
                        <form onSubmit={createContract}>
                            <div className="flex">
                                <ContractFormField label="Contract Type:" labelWidth="md:w-1/3" inputWidth="md:w-2/3" parentClass="items-center" >
                                    <select onChange={e => setFormData({ ...formData, contractType: e.target.value })}>
                                        {CONTRACT_TYPE.map(contract => (
                                            <option key={contract.type} value={contract.type} > {contract.description} </option>
                                        ))}
                                    </select>
                                </ContractFormField>
                                <ContractFormField label="Customer:" labelWidth="md:w-1/3" labelClass="pl-4" inputWidth="md:w-2/3" parentClass="items-center" >
                                    <select onChange={e => setFormData({ ...formData, customerId: e.target.value })}>
                                        <option value="" > Select a customer </option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id} > {customer.full_name} </option>
                                        ))}
                                    </select>
                                </ContractFormField>
                            </div>

                            <ContractFormField label="Resourses:" labelWidth="md:w-1/6" inputWidth="md:w-5/6" parentClass="items-center" >
                                <input value={formData.resourcesNumber} onChange={(e) => setFormData({ ...formData, resourcesNumber: parseInt(e.target.value) })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="number" />
                            </ContractFormField>

                            <div className="flex">
                                <ContractFormField label="Start Date:" labelWidth="md:w-1/3" inputWidth="md:w-2/3" parentClass="items-center" >
                                    <input value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="date" />
                                </ContractFormField>
                                <ContractFormField label="End Date:" labelWidth="md:w-1/3" labelClass="pl-4" inputWidth="md:w-2/3" parentClass="items-center" >
                                    <input value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="date" />
                                </ContractFormField>
                            </div>

                            {formData.contractType === "feature" &&
                                <>
                                    <div className="flex">
                                        <ContractFormField label="Feature Title:" labelWidth="md:w-1/3" inputWidth="md:w-2/3" parentClass="items-center" >
                                            <input value={formData.featureTitle} onChange={(e) => setFormData({ ...formData, featureTitle: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                        </ContractFormField>
                                        <ContractFormField label="Feature Cost:" labelWidth="md:w-1/3" labelClass="pl-4" inputWidth="md:w-2/3" parentClass="items-center" >
                                            <input value={formData.featureCost} onChange={(e) => setFormData({ ...formData, featureCost: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="number" />
                                        </ContractFormField>
                                    </div>
                                    <ContractFormField label="Feature Description:" labelWidth="md:w-1/6" inputWidth="md:w-5/6" parentClass="items-start" >
                                        <textarea value={formData.featureDescription} onChange={(e) => setFormData({ ...formData, featureDescription: e.target.value })} rows={4} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" />
                                    </ContractFormField>
                                </>
                            }
                            {formData.contractType === "hours" &&
                                <>
                                    <div className="flex">
                                        <ContractFormField label="Daily Hours:" labelWidth="md:w-1/3" inputWidth="md:w-2/3" parentClass="items-center" >
                                            <input value={formData.dailyHours} onChange={(e) => setFormData({ ...formData, dailyHours: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                        </ContractFormField>
                                        <ContractFormField label="Hourly Price:" labelWidth="md:w-1/3" labelClass="pl-4" inputWidth="md:w-2/3" parentClass="items-center" >
                                            <input value={formData.hourlyPrice} onChange={(e) => setFormData({ ...formData, hourlyPrice: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                        </ContractFormField>
                                    </div>
                                </>
                            }
                            <div className="flex justify-end">
                                <button className="bg-[#3D52A0] hover:bg-[#3D52A0]/90 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </Dashboard>
        </>
    );
}

const ContractFormField = ({ label, labelWidth, labelClass, inputWidth, parentClass, children }) => {
    return (
        <div className={("md:flex w-full mb-6 ") + parentClass}>
            <div className={labelWidth}>
                <label className={("block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4 ") + labelClass}>
                    {label}
                </label>
            </div>
            <div className={inputWidth}>
                {children}
            </div>
        </div>
    )
}