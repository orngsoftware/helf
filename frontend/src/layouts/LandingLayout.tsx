import { Outlet, useLocation } from "react-router-dom";
import NavbarHoriz from "../components/NavbarHoriz";

const LandingLayout = () => {
    const location = useLocation()
    const hideNavbarRoutes = ["/log-in", "/sign-up"]

    return (
        <>
            {!hideNavbarRoutes.includes(location.pathname) && <NavbarHoriz />}
            <Outlet />
        </>
    )
}

export default LandingLayout;