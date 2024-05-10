import { useAuth0 } from "@auth0/auth0-react";

import logo from '../assets/images/logo.png';
import darkLogo from '../assets/images/logodark.png';

export default function Login() {
    const { loginWithRedirect } = useAuth0();

    return (
        <section className="bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <a href="/" className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
                    <img src={logo} className="h-8 me-3 hidden dark:inline" alt="InvoiceFlow Logo" width={150} />
                    <img src={darkLogo} className="h-8 me-3 inline dark:hidden" alt="InvoiceFlow Logo" width={150} />
                </a>
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex flex-col items-center p-6 space-y-4 md:space-y-6 sm:p-8">
                        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                            Sign in to your account
                        </h1>
                        <button onClick={() => loginWithRedirect()} className="text-white bg-[#3D52A0] p-2 rounded-lg font-bold">
                            Log In
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                            Don't have an account yet?
                            <a href="/signup" className="font-medium text-[#3D52A0] dark:text-white hover:underline dark:text-primary-500 ml-1">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};