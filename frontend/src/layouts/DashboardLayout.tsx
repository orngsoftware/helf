import { isAuthenticated } from "../components/Auth"
import { Navigate, Outlet } from "react-router-dom"
import NavbarVert from "../components/NavbarVert"


const DashboardLayout = () => {

    if (!isAuthenticated()) {
        return <Navigate to="/log-in" />
    }
    
    return (
        <div className="section-row">
            <NavbarVert />
            <Outlet />
        </div>
    )
}

export default DashboardLayout;