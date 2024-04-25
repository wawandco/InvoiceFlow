import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button 
      className="text-gray-900 dark:text-white" 
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};