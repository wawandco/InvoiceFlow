import { useAuth0 } from "@auth0/auth0-react";

import Loading from '../components/Loading';
import Dashbboard from "../components/Dashboard";
import Login from "../components/Login";

export default function Home({ isSubscribed }) {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading></Loading>
  }

  if (!isAuthenticated) {
    return <Login></Login>
  }

  return (
    <>
      <Dashbboard isAuthenticated={isAuthenticated} activeTab="home" isSubscribed={isSubscribed} >
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">

        </div>
      </Dashbboard>
    </>
  );
}