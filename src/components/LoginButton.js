import { useAuth0 } from "@auth0/auth0-react";
import React from "react";

export default function LoginButton() {
  const { loginWithRedirect } = useAuth0();

  return (
    <button 
      className="text-white bg-[#3D52A0] p-2 rounded-lg font-bold" 
      onClick={() => loginWithRedirect()}
    >
      Log In
    </button>
  );
};