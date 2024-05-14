import { useAuth0 } from "@auth0/auth0-react";

import darkLogo from '../assets/images/logodark.png';

export default function Login() {
    const { loginWithRedirect } = useAuth0();

    return (
        <section className="bg-[#e6e6e6]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="flex flex-col items-center w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0">
                    <a href="/" className="m-8 text-2xl text-gray-900 dark:text-white">
                        <img src={darkLogo} alt="InvoiceFlow Logo" width={300} />
                    </a>

                    <div className="flex flex-col items-center px-6 pb-8 space-y-4 md:space-y-6">
                        <h1 className="text-xl leading-tight tracking-tight text-gray-900 md:text-2xl">
                            Sign in to your account
                        </h1>
                        <button onClick={() => loginWithRedirect()} className="text-white bg-[#3D52A0] py-2 px-12 rounded font-bold">
                            Log In
                        </button>
                        <p className="text-sm font-light text-gray-500 dark:text-gray-800">
                            Don't have an account yet?
                            <a href="/signup" className="font-medium text-[#3D52A0] hover:underline dark:text-primary-500 ml-1">
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};