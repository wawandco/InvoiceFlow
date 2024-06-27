import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import Moment from 'moment';

import { AuthContext } from "../contexts/AuthProvider";
import Header from "../components/Header";
import { supabase } from "../lib/supabase";

export default function Companies() {
  const { currentUser } = useContext(AuthContext);
  const [companies, setCompanies] = useState([]);

  const currentUserId = currentUser?.id

  useEffect(() => {
    async function getCompanies() {
      const { data } = await supabase.from('companies').select('*, admins_companies!inner(admin_id)').eq('admins_companies.admin_id', currentUserId)
      setCompanies(data);
    }

    if (currentUserId) {
      getCompanies();
    }
  }, [currentUserId]);

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
      <div className="p-4 sm:mt-16">
        <div className="flex items-center justify-between pb-3">
          <h1 className="font-bold">Companies ({companies.length})</h1>
          <Link to="/companies/new" className="text-white bg-[#3D52A0] px-4 py-1 rounded" > New </Link>
        </div>
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
      </div>
    </>
  );
}