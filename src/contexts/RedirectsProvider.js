import { createContext, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../contexts/AuthProvider";
import { SubscriptionContext } from "./SubscriptionProvider";

export const RedirectsContext = createContext()

export default function RedirectsProvider({ children }) {
    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { isSubscribed } = useContext(SubscriptionContext);

    useEffect(() => {
        const redirectUsers = () => {
            switch (currentUser.role) {
                case "Admin":
                    if (!isSubscribed) {
                        navigate("/pricing");
                    } else {
                        navigate("/companies");
                    }
                    break;
                case "Customer":
                    console.log("Redirect to the Customer page");
                    break;
                case "User":
                    console.log("Redirect to the User page");
                    break;
                default:
                    break;
            }
        }

        if (currentUser?.id) {
            redirectUsers();
        }
    }, [currentUser, isSubscribed, navigate]);

    return (
        <RedirectsContext.Provider value={{}}>
            {children}
        </RedirectsContext.Provider>
    )
}