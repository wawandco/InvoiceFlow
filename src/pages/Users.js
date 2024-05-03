import { useEffect, useState, useContext } from "react";
import { Link } from 'react-router-dom';
import Moment from 'moment';

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase"

export default function Users() {
    const { client } = useContext(DataContext);
    const [formData, setFormData] = useState({ full_name: "" })
    const [users, setUsers] = useState([]);

    useEffect(() => {
        getUsers();
    }, [client, formData]);

    async function getUsers() {
        if (client.id !== undefined) {
            const { data } = await supabase.from("users").select().eq('client_id', client.id);
            setUsers(data);
        }
    }

    async function createUser(e) {
        e.preventDefault()

        const { error } = await supabase.from('users')
            .insert({
                client_id: client.id,
                full_name: formData.full_name
            });

        if (error != null) {
            console.error(`ERROR creating user: ${error.message}`);
        }

        setFormData({ ...formData, full_name: "" })
    }

    const listUsers = users.map((user) =>
        <tr key={user.id}>
            {/* <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">{user.id}</p>
            </td> */}
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <Link to={("/user/") + user.id} className="text-black font-bold" target="_blank">{user.full_name}</Link>
                {/* <p className="text-black font-bold">{user.full_name}</p> */}
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">N/A</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="text-black">{Moment(user.created_at).format('MMMM DD, YYYY')}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900">N/A</span>
            </td>
        </tr>
    );

    return (
        <>
            <Dashboard activeTab="users">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <h1 className="font-bold mb-4">Create User</h1>

                    <div id='section2' className="p-4 mt-6 lg:mt-0 rounded shadow bg-white">
                        <form onSubmit={createUser}>
                            <div className="md:flex mb-6">
                                <div className="md:w-1/4">
                                    <label className="block text-gray-600 font-bold md:text-left mb-3 md:mb-0 pr-4" htmlFor="my-textfield">
                                        Full Name:
                                    </label>
                                </div>
                                <div className="md:w-3/4">
                                    <input value={formData.full_name} onChange={(e) => setFormData({ ...formData, full_name: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button className="shadow bg-yellow-700 hover:bg-yellow-500 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="mt-8">
                    <h1 className="font-bold mb-4">Users</h1>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[#3d52a0] text-left text-xs font-semibold uppercase tracking-widest text-white">
                                {/* <th className="px-5 py-3">ID</th> */}
                                <th className="px-5 py-3">Full Name</th>
                                <th className="px-5 py-3">User Role</th>
                                <th className="px-5 py-3">Created at</th>
                                <th className="px-5 py-3">Status</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-500">
                            {listUsers}
                        </tbody>
                    </table>
                </div>
            </Dashboard>
        </>
    );
}