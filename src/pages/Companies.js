import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Moment from 'moment';

import { AuthContext } from "../contexts/AuthProvider";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export default function Companies() {
  const { currentUser } = useContext(AuthContext);
  const [formData, setFormData] = useState({ name: "" })
  const [companies, setCompanies] = useState([]);

  const currentUserId = currentUser?.id
  const formDataName = formData?.name === ""

  useEffect(() => {
    async function getCompanies() {
      const { data } = await supabase.from('companies').select('*, admins_companies!inner(admin_id)').eq('admins_companies.admin_id', currentUserId)
      setCompanies(data);
    }

    if (currentUserId && formDataName) {
      getCompanies();
    }
  }, [currentUserId, formDataName]);

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

  const listCompanies = companies?.map((company) =>
    <tr key={company.id}>
      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <Link to={("/") + company.id + ("/payments")} className="text-black font-bold">{company.name}</Link>
        {/* <p className="text-black">{company.name}</p> */}
      </td>
      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <p className="text-black">{Moment(company.created_at).format('MMMM DD, YYYY')}</p>
      </td>
      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <p className="text-black">N/A</p>
      </td>
      <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
        <p className="text-black">N/A</p>
      </td>
    </tr>
  );

  return (
    <>
      <Header />
      <div className="flex justify-between p-4 sm:mt-16">
        <aside className="h-screen sticky top-[80px] w-1/4">
          <div className="w-full max-w-sm p-3 bg-white border border-gray-200 rounded-lg shadow">
            <h5 className="text-xl font-medium mb-3">New Company</h5>
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
                <button className={`bg-[#3D52A0] hover:bg-[#3D52A0]/90 shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`} type="submit">
                  {/* <button className={`${listUsers.length === maxUser ? "pointer-events-none bg-gray-600" : "bg-[#3D52A0] hover:bg-[#3D52A0]/90"} shadow focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded`} type="submit"> */}
                  Create
                </button>
              </div>
            </form>
          </div>
        </aside>
        <aside className="w-3/4 ml-4">
          <h1 className="font-bold mb-4">Companies ({companies.length})</h1>
          <table className="w-full">
            <thead>
              <tr className="bg-[#3d52a0] text-left text-xs font-semibold uppercase tracking-widest text-white">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Created at</th>
                <th className="px-5 py-3">Test</th>
                <th className="px-5 py-3">Test</th>
              </tr>
            </thead>
            <tbody className="text-gray-500">
              {listCompanies}
            </tbody>
          </table>
        </aside>
      </div>
    </>
  );
}