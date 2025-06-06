import { Link } from "react-router-dom"
import { useState } from "react"


const NavbarHoriz = () => {
    const [menuOpen, openMenu] = useState(false)
    const toggleMenu = () => {
        if (menuOpen == false) {
            openMenu(true)
        }
        else {
            openMenu(false)
        }
    }
    return (
        <nav>
            <div className='nav-bar-horz'>
                <svg xmlns="http://www.w3.org/2000/svg" onClick={toggleMenu} width="32" height="32" fill="#000000" className="hamburger-icon" viewBox="0 0 256 256">{menuOpen ? (
                    /* Cross Icon */
                    <path d="M200.49,71.51a8,8,0,0,0-11.31,0L128,132.69,66.83,71.51a8,8,0,1,0-11.31,11.31L116.69,144,55.51,205.17a8,8,0,1,0,11.31,11.31L128,155.31l61.17,61.17a8,8,0,0,0,11.31-11.31L139.31,144l61.17-61.17A8,8,0,0,0,200.49,71.51Z"></path>
                    ) : (
                    /* Hamburger Icon */
                    <path d="M224,128a8,8,0,0,1-8,8H40a8,8,0,0,1,0-16H216A8,8,0,0,1,224,128ZM40,72H216a8,8,0,0,0,0-16H40a8,8,0,0,0,0,16ZM216,184H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16Z"></path>
                )}</svg>
                <Link to="/" className="rm-on-sm-screen"><img className="logo-img" src="./src/assets/logowithname.png" alt="Helf Logo"></img></Link>
                <ul className={`nav-links ${menuOpen ? "opened" : ""}`}>
                    <li><Link to="/" onClick={toggleMenu}>Home</Link></li>
                    <li><Link to="/products" onClick={toggleMenu}>Products</Link></li>
                    <li><Link to="/about" onClick={toggleMenu}>About</Link></li>
                </ul>
                <div className="sign-up-link">
                    <Link to="/dashboard/plan/1">Log In</Link>
                    <Link to="/sign-up">
                        <button className="btn-primary signup">Start Now</button>
                    </Link>
                </div>
            </div>
        </nav>
    )
}
    
export default NavbarHoriz;

