import { useContext } from "react";
import { Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faBuilding } from '@fortawesome/free-solid-svg-icons';
import { faPaperclip } from '@fortawesome/free-solid-svg-icons';

import { CompanyContext } from "../contexts/CompanyProvider";
import Header from "./Header";

export default function Dashboard({ activeTab, showSidebar, children }) {
    const { user } = useAuth0();
    const { companyId, company } = useContext(CompanyContext);

    return (
        <>
            <Header companyId={companyId} companyName={company.name} activeTab={activeTab} />
            {showSidebar ?
                <>
                    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full border-r sm:translate-x-0 dark:bg-[#3D52A0]" aria-label="Sidebar">
                        <div className="flex flex-col justify-between h-full">
                            <div className="bg-white dark:bg-[#3D52A0]">
                                <ul className="font-medium">
                                    {user.role === "Admin" &&
                                        <li className='m-0'>
                                            <Link to={("/") + companyId + ("/customers")} className={(activeTab === "customers" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                                <FontAwesomeIcon icon={faUsers} />
                                                <span className="flex-1 ms-3 whitespace-nowrap">Customers</span>
                                            </Link>
                                        </li>
                                    }
                                    <li className='m-0'>
                                        <Link to={("/") + companyId + ("/payments")} className={(activeTab === "payments" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                            <FontAwesomeIcon icon={faMoneyCheckDollar} />
                                            <span className="flex-1 ms-3 whitespace-nowrap">Payments</span>
                                        </Link>
                                    </li>
                                    <li className='m-0'>
                                        <Link to={("/") + companyId + ("/contracts")} className={(activeTab === "contracts" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                            <FontAwesomeIcon icon={faPaperclip} />
                                            <span className="flex-1 ms-3 whitespace-nowrap">Contracts</span>
                                        </Link>
                                    </li>
                                    <li className='m-0'>
                                        <Link to={("/") + companyId + ("/company")} className={(activeTab === "company" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                            <FontAwesomeIcon icon={faBuilding} />
                                            <span className="flex-1 ms-3 whitespace-nowrap">Company Info</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="bg-white dark:bg-[#3D52A0]">
                                <ul className="font-medium">
                                    {user.role === "Admin" &&
                                        <li className='m-0'>
                                            <Link to="/companies/new" className={(activeTab === "customers" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                                <FontAwesomeIcon icon={faPlus} />
                                                <span className="flex-1 ms-3 whitespace-nowrap">Add a new company</span>
                                            </Link>
                                        </li>
                                    }
                                </ul>
                            </div>
                        </div>
                    </aside>
                    <div className="p-4 sm:ml-64 sm:mt-14">
                        {children}
                    </div>
                </>
                :
                <div className="p-4 sm:mt-14">
                    {children}
                </div>
            }
        </>
    );
};