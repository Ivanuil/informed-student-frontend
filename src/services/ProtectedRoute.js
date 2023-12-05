import {Navigate, Outlet} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../App";

const ProtectedRoute = ({ redirectPath = '/login', allowedRoles, children }) => {

    const {user} = useContext(AppContext);

    const hasAnyRole = () => {
        if (!allowedRoles || allowedRoles.length === 0) return true;
        return user.roles.some(r => allowedRoles.some(ar => ar === r));
    }

    if (!user || !hasAnyRole()) {
        return <Navigate to={redirectPath} replace />;
    }
    return children ? children : <Outlet />;
};

export default ProtectedRoute;