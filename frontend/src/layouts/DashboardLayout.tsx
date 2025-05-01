import { Outlet, useLocation } from "react-router-dom"
import NavbarVert from "../components/NavbarVert"


const DashboardLayout = () => {
    const location = useLocation()

    return (
        location.pathname === "/start" ? <Outlet /> : 
        <div className="section-row">
            <NavbarVert />
            <Outlet />
        </div>
    );
} 

export default DashboardLayout;