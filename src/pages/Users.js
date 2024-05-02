import { useEffect, useState, useContext } from "react";
import Moment from 'moment';

import { DataContext } from "../components/DataProvider";
import Dashboard from "../components/Dashboard";
import { supabase } from "../lib/supabase"

export default function Users() {
    const { user, isAuthenticated } = useContext(DataContext);
    const [formData, setFormData] = useState({ fullName: "" })
    const [userId, setUserId] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        var userId = ""
        if (isAuthenticated) {
            userId = user.sub
        }

        setUserId(userId);
    }, [user]);

    useEffect(() => {
        getUsers();
    }, [userId, formData]);

    async function getUsers() {
        if (userId !== "") {
            console.log(userId);
            const { data } = await supabase.from("users").select().eq('auth0_user_id', userId);
            setUsers(data);
        }
    }

    async function createUser(e) {
        e.preventDefault()

        const { error } = await supabase.from('users')
            .insert({ full_name: formData.fullName, auth0_user_id: userId });

        if (error != null) {
            console.error(`ERROR on user INSERT: ${error.message}`);
        }

        setFormData({ ...formData, fullName: "" })
    }

    const listUsers = users.map((user) =>
        <tr key={user.id}>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{user.id}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{user.full_name}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">Administrator</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <p className="whitespace-no-wrap">{Moment(user.created_at).format('MMMM DD, YYYY')}</p>
            </td>
            <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                <span className="rounded-full bg-green-200 px-3 py-1 text-xs font-semibold text-green-900">Active</span>
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
                                    <input value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#3D52A0]/80 sm:text-sm sm:leading-6 p-2" type="text" />
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
                                <th className="px-5 py-3">ID</th>
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