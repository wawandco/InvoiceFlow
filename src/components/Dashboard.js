import { useContext } from "react";

import logo from '../assets/images/logo.png';
import darkLogo from '../assets/images/logodark.png';

import { DataContext } from "../components/DataProvider";
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckDollar } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faCalendarDays } from '@fortawesome/free-solid-svg-icons';

export default function Dashboard({ activeTab, children }) {
    const { client, isAuthenticated, isSubscribed } = useContext(DataContext);

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-[#3D52A0] dark:border-[#3D52A0]-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <a href="/" className="flex items-center ms-2 md:me-24">
                                <img src={logo} className="h-8 me-3 hidden dark:inline" alt="InvoiceFlow Logo" />
                                <img src={darkLogo} className="h-8 me-3 inline dark:hidden" alt="InvoiceFlow Logo" />
                                <h1 className="font-bold dark:text-white"> - {client.name}'s Company</h1>
                            </a>
                        </div>

                        <div>
                            {isAuthenticated ? <LogoutButton></LogoutButton> : <LoginButton></LoginButton>}
                        </div>
                    </div>
                </div>
            </nav>
            <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform -translate-x-full border-r sm:translate-x-0 dark:bg-[#3D52A0]" aria-label="Sidebar">
                <div className="h-full pb-4 overflow-y-auto bg-white dark:bg-[#3D52A0]">
                    <ul className="font-medium">
                        {/* <li className='m-0'>
                            <a href="/" className={(activeTab === "home" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                            </a>
                        </li> */}
                        <li className='m-0'>
                            <Link to="/" className={(activeTab === "payments" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <FontAwesomeIcon icon={faMoneyCheckDollar} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Payments</span>
                            </Link>
                        </li>
                        <li className='m-0'>
                            <Link to="/users" className={(activeTab === "users" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <FontAwesomeIcon icon={faUsers} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                            </Link>
                        </li>
                        <li className='m-0'>
                            <Link to="/work-hours" className={(activeTab === "workHours" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <FontAwesomeIcon icon={faClockRotateLeft} />
                                <span className="flex-1 ms-3 whitespace-nowrap">User Work Hours</span>
                            </Link>
                        </li>
                        <li className='m-0'>
                            <Link to="/profile" className={(activeTab === "profile" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <FontAwesomeIcon icon={faIdCard} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                            </Link>
                        </li>
                        {!isSubscribed &&
                            <Link to="/pricing" className={(activeTab === "pricing" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <FontAwesomeIcon icon={faCalendarDays} />
                                <span className="flex-1 ms-3 whitespace-nowrap">Pricing</span>
                            </Link>
                        }
                    </ul>
                </div>
            </aside>

            <div className="p-4 sm:ml-64 sm:mt-14">
                {children}
            </div>
        </>
    );
};