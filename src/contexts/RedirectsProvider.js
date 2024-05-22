import { createContext, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { AuthContext } from "../contexts/AuthProvider";
import { SubscriptionContext } from "./SubscriptionProvider";

export const RedirectsContext = createContext()

export default function RedirectsProvider({ children }) {
    const location = useLocation();
    const { pathname } = location;

    const navigate = useNavigate();
    const { currentUser } = useContext(AuthContext);
    const { isSubscribed } = useContext(SubscriptionContext);

    useEffect(() => {
        // const redirectUsers = () => {
        //     switch (currentUser.role) {
        //         case "Admin":
        //             if (isSubscribed && (pathname === "/" || pathname === "/pricing" || pathname === "/welcome")) {
        //                 navigate("/companies");
        //             }
        //             if (!isSubscribed) {
        //                 navigate("/welcome");
        //             }
        //             break;
        //         case "Customer":
        //             console.log("Redirect to the Customer page");
        //             break;
        //         case "User":
        //             console.log("Redirect to the User page");
        //             break;
        //         default:
        //             break;
        //     }
        // }

        // if (currentUser?.id) {
        //     redirectUsers();
        // }

        if (currentUser?.id) {
            if (isSubscribed && (pathname === "/" || pathname === "/pricing" || pathname === "/welcome")) {
                navigate("/companies");
            }
            if (!isSubscribed && pathname !== "/pricing") {
                navigate("/welcome");
            }
        }
    }, [currentUser, isSubscribed, navigate, pathname]);

    return (
        <RedirectsContext.Provider value={{}}>
            {children}
        </RedirectsContext.Provider>
    )
}