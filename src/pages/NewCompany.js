import { useState, useContext } from "react";

import { AuthContext } from "../contexts/AuthProvider";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export default function NewCompany() {
    const { currentUser } = useContext(AuthContext);
    const [formData, setFormData] = useState({ name: "" })

    const currentUserId = currentUser?.id

    async function createCompany(e) {
        e.preventDefault()

        const { data: company, error } = await supabase.from('companies').insert({ name: formData.name }).select().single();

        if (error !== null) {
            console.error(`ERROR creating user: ${error.message}`);
        }

        if (error === null) {
            const { error } = await supabase.from('admins_companies').insert({
                admin_id: currentUserId,
                company_id: company.id
            });

            if (error != null) {
                console.error(`ERROR associating the admin with the company: ${error.message}`);
            } else {
                setFormData({ ...formData, name: "" })
            }
        }
    }

    return (
        <>
            <Header />
            <div className="w-full flex flex-col p-4 sm:mt-16">
                <h1 className="mb-4 text-2xl">New company</h1>
                <div className="flex justify-center">
                    <div className="w-full max-w-sm p-5 bg-white border border-gray-200 rounded-lg shadow">
                        <form onSubmit={createCompany}>
                            <div className="md:flex mb-6">
                                <div className="md:w-1/4">
                                    <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="my-textfield">
                                        Name:
                                    </label>
                                </div>
                                <div className="md:w-3/4">
                                    <input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <a href="/companies" className="text-white bg-[#CECECE] hover:bg-[#CECECE]/90 py-2 px-4 rounded-md mr-4">Cancel</a>
                                <button className={`bg-[#3D52A0] hover:bg-[#3D52A0]/90 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`} type="submit">
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}