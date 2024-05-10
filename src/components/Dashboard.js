import { useContext } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';

import { CompanyContext } from "../contexts/CompanyProvider";
import Header from "./Header";

export default function Dashboard({ activeTab, showSidebar, children }) {
    const { companyId } = useContext(CompanyContext);

    return (
        <>
            <Header />
            {showSidebar ?
                <>
                    <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-16 transition-transform -translate-x-full border-r sm:translate-x-0 dark:bg-[#3D52A0]" aria-label="Sidebar">
                        <div className="h-full pb-4 overflow-y-auto bg-white dark:bg-[#3D52A0]">
                            <ul className="font-medium">
                                <li className='m-0'>
                                    <Link to={("/") + companyId + ("/payments")} className={(activeTab === "payments" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                        <FontAwesomeIcon icon={faMoneyCheckDollar} />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Payments</span>
                                    </Link>
                                </li>
                                <li className='m-0'>
                                    <Link to={("/") + companyId + ("/users")} className={(activeTab === "users" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                        <FontAwesomeIcon icon={faUsers} />
                                        <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                                    </Link>
                                </li>
                                <li className='m-0'>
                                    <Link to={("/") + companyId + ("/work-hours")} className={(activeTab === "workHours" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                        <FontAwesomeIcon icon={faClockRotateLeft} />
                                        <span className="flex-1 ms-3 whitespace-nowrap">User Work Hours</span>
                                    </Link>
                                </li>
                            </ul>
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