import {Navigate, Outlet} from "react-router-dom";
import {useContext} from "react";
import {AppContext} from "../App";

const ProtectedRoute = ({ redirectPath = '/login', children }) => {

    const user = useContext(AppContext);

    console.log(user);
    if (!user) {
        return <Navigate to={redirectPath} replace />;
    }
    return children ? children : <Outlet />;
};

export default ProtectedRoute;