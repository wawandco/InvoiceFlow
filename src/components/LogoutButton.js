import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <button 
      className="text-gray-900 dark:text-white" 
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      Log Out
    </button>
  );
};