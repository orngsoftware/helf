import { Link, Navigate } from "react-router-dom";
import { House, SignOut, ListChecks} from "@phosphor-icons/react";


const NavbarVert = () => {
    const logOut = () => {
        localStorage.removeItem("token")
        return <Navigate to="/" />
    }

    return (
        <div className="white-card nav-bar-vert">
            <Link to="/dashboard" className="rm-on-sm-screen"><img className="logo-img" src="./src/assets/logowithname.png" alt="Helf Logo" style={{marginLeft: 0, paddingTop: 30}}></img></Link>
            <div className="sm-row sd-item">
                <House className="nav-icon" weight="bold"/>
                <Link to="/dashboard" style={{marginLeft: 5}}>Dashboard</Link>
            </div>
            <div className="sm-row sd-item">
                <ListChecks className="nav-icon" weight="bold"/>
                <Link to="/dashboard/all-plans" style={{marginLeft: 5}}>All Plans</Link>
            </div>
            <div className="sm-row sd-item last-sd-item">
                <SignOut className="nav-icon" weight="bold" color="red"/>
                <Link to="" onClick={logOut} style={{marginLeft: 5, color: "red"}}>Log Out</Link>
            </div>
        </div>
    )
}

export default NavbarVert;