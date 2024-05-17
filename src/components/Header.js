import { useContext } from "react";
import Stripe from "stripe";
import { useAuth0 } from "@auth0/auth0-react";
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react'

import logo from '../assets/images/logo.png';
import darkLogo from '../assets/images/logodark.png';
import { AuthContext } from "../contexts/AuthProvider";
import { SubscriptionContext } from "../contexts/SubscriptionProvider";

const STRIPE_SECRET_KEY = process.env.REACT_APP_STRIPE_SECRET_KEY

export default function Header() {
    const { logout } = useAuth0();
    const { user, currentUser, isAuthenticated } = useContext(AuthContext);
    const { isSubscribed, productName } = useContext(SubscriptionContext);

    const manageSubscription = async () => {
        const stripe = Stripe(STRIPE_SECRET_KEY);

        const session = await stripe.billingPortal.sessions.create({
            customer: currentUser.stripe_customer_id,
            return_url: `${window.location.href}`,
        });
        window.location.href = session.url
    }

    return (
        <>
            <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-[#3D52A0] dark:border-[#3D52A0]-700">
                <div className="px-3 py-3 lg:px-5 lg:pl-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <a href="/" className="flex items-center ms-2 md:me-24">
                                <img src={logo} className="h-8 me-3 hidden dark:inline" alt="InvoiceFlow Logo" />
                                <img src={darkLogo} className="h-8 me-3 inline dark:hidden" alt="InvoiceFlow Logo" />
                                {/* <h1 className="font-bold dark:text-white"> - {client.name}'s Company</h1> */}
                            </a>
                        </div>
                        <Menu>
                            <MenuButton>
                                <img src={user.picture} alt="" className="mx-auto rounded-full dark:bg-gray-500 aspect-square" width={40} />
                            </MenuButton>
                            <MenuItems className="top-[55px] right-[18px] absolute w-[200px] bg-white divide-y divide-gray-100 rounded-md shadow-lg">
                                <MenuItem className="py-1 px-2">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-bold">{currentUser.full_name} ({currentUser.role})</span>
                                        <span className="text-sm">{currentUser.email}</span>
                                    </div>
                                </MenuItem>
                                {isSubscribed &&
                                    <MenuItem className="py-1 px-2">
                                        <div className="flex flex-col">
                                            <span className="text-sm font-bold">{ productName } Plan</span>
                                            <button onClick={manageSubscription} className="text-sm italic underline underline-offset-1 text-start text-[#3D52A0]">Manage your subscription</button>
                                        </div>
                                    </MenuItem>
                                }
                                {isAuthenticated &&
                                    <MenuItem className="py-1 px-2">
                                        {/* onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })} */}
                                        <a href="/" onClick={logout} className="block data-[focus]:bg-blue-100">
                                            Sign Out
                                        </a>
                                    </MenuItem>
                                }
                            </MenuItems>
                        </Menu>
                    </div>
                </div>
            </nav>
        </>
    );
};