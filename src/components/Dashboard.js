import { useContext } from "react";

import logo from '../assets/images/logo.png';
import darkLogo from '../assets/images/logodark.png';

import { DataContext } from "../components/DataProvider";
import LoginButton from '../components/LoginButton';
import LogoutButton from '../components/LogoutButton';

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
                                <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-white"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Home</span>
                            </a>
                        </li> */}
                        <li className='m-0'>
                            <a href="/" className={(activeTab === "payments" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-white"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Payments</span>
                            </a>
                        </li>
                        <li className='m-0'>
                            <a href="/users" className={(activeTab === "users" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-white"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Users</span>
                            </a>
                        </li>
                        <li className='m-0'>
                            <a href="/work-hours" className={(activeTab === "workHours" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-white"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Work Hours</span>
                            </a>
                        </li>
                        <li className='m-0'>
                            <a href="/profile" className={(activeTab === "profile" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-white"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                </svg>
                                <span className="flex-1 ms-3 whitespace-nowrap">Profile</span>
                            </a>
                        </li>
                        {!isSubscribed &&
                            <li className='m-0'>
                                <a href="/pricing" className={(activeTab === "billing" ? "bg-gray-300 dark:bg-[#7091E6] " : "") + "flex items-center p-2 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-[#7091E6] group"}>
                                    <svg className={"flex-shrink-0 w-5 h-5 text-gray-500 transition duration-75 dark:text-white"} aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                        <path d="M14 2a3.963 3.963 0 0 0-1.4.267 6.439 6.439 0 0 1-1.331 6.638A4 4 0 1 0 14 2Zm1 9h-1.264A6.957 6.957 0 0 1 15 15v2a2.97 2.97 0 0 1-.184 1H19a1 1 0 0 0 1-1v-1a5.006 5.006 0 0 0-5-5ZM6.5 9a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9ZM8 10H5a5.006 5.006 0 0 0-5 5v2a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-2a5.006 5.006 0 0 0-5-5Z" />
                                    </svg>
                                    <span className="flex-1 ms-3 whitespace-nowrap">Pricing</span>
                                </a>
                            </li>
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