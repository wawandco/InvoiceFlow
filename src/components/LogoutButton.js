import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function LogoutButton() {
  const { logout } = useAuth0();

  return (
    <button 
      className="text-gray-900 dark:text-white" 
      onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
    >
      <FontAwesomeIcon icon={faArrowRightFromBracket} />
    </button>
  );
};