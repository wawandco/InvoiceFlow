import { useEffect, useState, useContext } from "react";
import Moment from 'moment';

import { Document, Page, Text, View, Image, Svg, Line, PDFViewer } from "@react-pdf/renderer";
import { createTw } from "react-pdf-tailwind";
import SignatureCanvas from 'react-signature-canvas';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons';

import { AuthContext } from "../contexts/AuthProvider";
import { supabase } from "../lib/supabase";

const tw = createTw({
    theme: {
        fontFamily: {
            sans: ["Comic Sans"],
        }
    },
});

export default function ContractDocument({ contract }) {
    const today = new Date();

    const { user } = useContext(AuthContext);
    const [customer, setCustomer] = useState({});
    const [company, setCompany] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [companySign, setCompanySign] = useState("");
    const [customerSign, setCustomerSign] = useState("");
    const currentDate = today.getMonth() + 1 + "/" + today.getDate() + "/" + today.getFullYear();

    let signature = {};
    let contractCost = 0.0

    switch (contract.contract_type) {
        case "feature":
            contractCost = contract.feature_cost
            break;
        case "hours":
            var start = Moment(contract.start_date);
            var end = Moment(contract.end_date);
            let diff = end.diff(start, "days") + 1

            contractCost = contract.resources_number * (contract.daily_hours * contract.hourly_price) * diff
            break;
        default:
            contractCost = 0.0
            break;
    }
    contractCost = new Intl.NumberFormat().format(contractCost);

    useEffect(() => {
        async function getCustomer() {
            const { data } = await supabase.from("customers").select().eq('id', contract.customer_id).single();

            if (data !== null && Object.keys(customer).length === 0) {
                setCustomer(data);
            }
        }
        async function getCompany() {
            const { data } = await supabase.from("companies").select().eq('id', contract.company_id).single();

            if (data !== null && Object.keys(company).length === 0) {
                setCompany(data);
            }
        }

        getCustomer();
        getCompany();
    }, [contract]);

    const handleOpen = () => setShowModal(!showModal);

    async function signDocument() {
        const base64Image = signature.getTrimmedCanvas().toDataURL('image/png');

        let data = {}

        if (user.role === "Admin") {
            let status = "customer_signature_pending"
            if (contract.customer_sign !== null) {
                status = "completed"
            }

            data = {
                company_sign: base64Image,
                status: status,
            }
            setCompanySign(base64Image);
        }

        if (user.role === "Customer") {
            let status = "company_signature_pending"
            if (contract.company_sign !== null) {
                status = "completed"
            }

            data = {
                customer_sign: base64Image,
                status: status,
            }
            setCustomerSign(base64Image);
        }

        const { error } = await supabase.from("contracts").update(data).eq('id', contract.id)

        if (error) {
            console.error(`ERROR updating contract: ${error.message}`);
        }

        setShowModal(!showModal);
    }

    return (
        <>
            {showModal &&
                <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 bg-black/80 text-white">
                    <div className="flex items-center justify-center h-screen">
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                            <div className="relative bg-white rounded-lg shadow">
                                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
                                    <h3 className="text-xl text-black">
                                        Sign Document
                                    </h3>
                                    <button onClick={handleOpen} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white">
                                        <FontAwesomeIcon icon={faX} />
                                    </button>
                                </div>
                                <div className="flex justify-center p-4">
                                    <SignatureCanvas
                                        canvasProps={{ className: 'w-full h-[200px] border-2 rounded' }}
                                        ref={(ref) => { signature = ref }}
                                    />
                                </div>
                                <div className="flex items-center justify-end p-4 md:p-5 border-t rounded-b">
                                    <button onClick={handleOpen} type="button" className="text-white bg-[#CECECE] hover:bg-[#CECECE]/90 py-2 px-4 rounded-md">Cancel</button>
                                    <button onClick={signDocument} type="button" className="ml-4 text-white bg-[#3D52A0] hover:bg-[#3D52A0]/90 py-2 px-4 rounded-md">Sign</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            }
            {contract.status !== "completed" &&
                <div className="absolute right-10 bottom-3">
                    <button onClick={handleOpen} className="ml-4 text-white bg-[#3D52A0] hover:bg-[#3D52A0]/90 py-2 px-4 rounded-md">
                        Sign Document
                    </button>
                </div>
            }
            <PDFViewer style={tw("w-full h-screen")}>
                <Document title="Contract Document">
                    <Page size="LETTER" style={tw("bg-white text-black py-5 px-10")}>
                        <View style={tw("pt-5 flex items-center")}>
                            <Text style={tw("font-bold text-3xl")}>Contract of Employment</Text>
                        </View>

                        <View>
                            <Text style={tw("font-bold text-sm mb-1")}>This contract is made and entered into as of {currentDate}, by and between:</Text>

                            <Text style={tw("text-base font-bold mb-1 mt-4")}>Company:</Text>
                            <Text style={tw("text-sm mb-1")}>{company.name}</Text>

                            <Text style={tw("text-base font-bold mb-1 mt-4")}>Customer:</Text>
                            <Text style={tw("text-sm mb-1")}>{customer.full_name}</Text>
                            <Text style={tw("text-sm mb-1")}>{customer.email}</Text>
                        </View>

                        <View>
                            {contract.contract_type === "feature" &&
                                <Text style={tw("text-sm mt-10 text-justify")}>
                                    Pursuant to this contract, the company commits to developing and delivering the functionality titled <Text style={tw("text-red-400")}>{contract.feature_title}</Text>, described as follows: <Text style={tw("text-red-400")}>{contract.feature_description}</Text>. This project will commence on <Text style={tw("text-red-400")}>{contract.start_date}</Text> and will extend until <Text style={tw("text-red-400")}>{contract.end_date}</Text>, during which our team will ensure that all specifications and requirements are met. A team of <Text style={tw("text-red-400")}>{contract.resources_number}</Text> resources highly skilled professionals will be assigned to this task, bringing their expertise and knowledge to guarantee excellence in service delivery. The total cost of the work, which includes all necessary resources and activities to complete the functionality, amounts to <Text style={tw("text-red-400")}>$ {contractCost}</Text>. This contract stipulates that the company is responsible for performing the service with the highest quality and efficiency, adhering to the agreed timelines and conditions, and ensuring that the final outcome meets the client's expectations and needs. Additionally, periodic reviews and progress reports will be conducted to keep the client informed about the project's advancement and any contingencies that may arise during its development.
                                </Text>
                            }

                            {contract.contract_type === "hours" &&
                                <Text style={tw("text-sm mt-10 text-justify")}>Pursuant to this contract, the company commits to providing services from <Text style={tw("text-red-400")}>{contract.start_date}</Text> to <Text style={tw("text-red-400")}>{contract.end_date}</Text>. During this period, a team of <Text style={tw("text-red-400")}>{contract.resources_number}</Text> resources will be assigned to the project, each working <Text style={tw("text-red-400")}>{contract.daily_hours}</Text> hours per day. The hourly rate for these services is <Text style={tw("text-red-400")}>$ {contract.hourly_price}</Text>, resulting in a total cost of <Text style={tw("text-red-400")}>$ {contractCost}</Text> for the entire contract period. This arrangement ensures that the client will receive dedicated and continuous support throughout the contract period, with a focus on delivering high-quality results. The total number of hours worked will be carefully tracked and documented, and the company will provide regular updates and progress reports to keep the client informed. This contract guarantees that the company will perform the services with the utmost professionalism and efficiency, adhering to the agreed timelines and conditions, ensuring that the client’s requirements and expectations are fully met.</Text>
                            }
                        </View>

                        <View style={tw("mt-[80px]")}>
                            <Text style={tw("text-sm mt-10 text-justify")}>By signing below, both parties acknowledge that they have read, understood, and agree to all terms and conditions outlined in this contract.</Text>
                        </View>

                        <View style={tw("flex flex-row justify-around mt-[120px]")}>
                            <View style={tw("flex items-center")}>
                                <View style={tw("w-[100px] h-[40px] flex items-center justify-center")}>
                                    {(contract.company_sign !== null || companySign !== "") &&
                                        <Image src={companySign !== "" ? companySign : contract.company_sign} />
                                    }
                                </View>
                                <Svg height="5" width="230" style={tw("mb-3")}>
                                    <Line x1="0" y1="5" x2="230" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
                                </Svg>
                                <Text style={tw("text-lg mb-1")}>{company.name}'s legal representative</Text>
                            </View>

                            <View style={tw("flex items-center")}>
                                <View style={tw("w-[100px] h-[40px] flex items-center justify-center")}>
                                    {(contract.customer_sign || customerSign !== "") &&
                                        <Image src={customerSign !== "" ? customerSign : contract.customer_sign} />
                                    }
                                </View>
                                <Svg height="5" width="230" style={tw("mb-3")}>
                                    <Line x1="0" y1="5" x2="230" y2="5" strokeWidth={1} stroke="rgb(0,0,0)" />
                                </Svg>
                                <Text style={tw("text-lg mb-1")}>{customer.full_name}</Text>
                            </View>
                        </View>
                    </Page>
                </Document>
            </PDFViewer>
        </>
    );
}