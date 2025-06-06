import { Link } from "react-router-dom";

const Footer = () => {
    return (
        <footer className="footer">
            <div className="sm-row" style={{gap: 15}}>
                <Link to="/privacy-policy">Privacy Policy</Link>
                <Link to="/terms-of-service">Terms of Service</Link>
            </div>
            <a href="mailto: while.no.helf@gmail.com" target="_blank">while.no.helf@gmail.com</a>
            <p style={{marginTop: 15}}>© 2025 Helf. All rights reserved</p>
        </footer>
    )
}

export default Footer;