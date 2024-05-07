import { useEffect, useState } from "react";
import { NumericFormat } from 'react-number-format';
import { Link } from 'react-router-dom';

import { supabase } from "../lib/supabase";

export default function UserWorkHoursTable({ uwk }) {
    const [user, setUser] = useState({});

    useEffect(() => {
        async function getUser() {
            const { data } = await supabase.from("users").select().eq('id', uwk.user_id).single();
            setUser(data);
        }

        getUser();
    }, [uwk]);

    return (
        <>
            <tr key={uwk.id}>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <Link to={("/user/") + uwk.user_id} className="text-black font-bold" target="_blank">{user.full_name}</Link>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="text-black">{uwk.hours}</p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="text-black">$ {uwk.hourly_price}</p>
                </td>
                <td className="border-b border-gray-200 bg-white px-5 py-5 text-sm">
                    <p className="text-black">
                        $ <NumericFormat value={Math.round((uwk.hours * uwk.hourly_price) * 100) / 100} displayType="text" thousandSeparator="," />
                    </p>
                </td>
            </tr>
        </>
    );
}