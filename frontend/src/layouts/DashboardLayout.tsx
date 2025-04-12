import { isAuthenticated } from "../components/Auth"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import NavbarVert from "../components/NavbarVert"


const DashboardLayout = () => {
    const location = useLocation()

    if (!isAuthenticated()) {
        return <Navigate to="/log-in" />
    }

    return (
        location.pathname === "/start" ? <Outlet /> : 
        <div className="section-row">
            <NavbarVert />
            <Outlet />
        </div>
    );
} 

export default DashboardLayout;