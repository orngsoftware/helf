import { Outlet, useLocation } from "react-router-dom";
import NavbarHoriz from "../components/NavbarHoriz";
import Footer from "../components/Footer";
import { useEffect } from "react";

const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        window.scrollTo(0,0)
    }, [pathname])

    return null;
}

const LandingLayout = () => {
    const location = useLocation()
    const hideNavbarRoutes = ["/log-in", "/sign-up"]

    return (
        <>
            <ScrollToTop />
            {!hideNavbarRoutes.includes(location.pathname) && <NavbarHoriz />}
            <Outlet />
            {!hideNavbarRoutes.includes(location.pathname) && <Footer />}
        </>
    )
}

export default LandingLayout;