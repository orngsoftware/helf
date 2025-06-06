import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className='center-section'>
            <h1>Do you want to improve your health?</h1>
            <h3>Improve your <span style={{fontWeight: "bold"}}>nutrition simpler</span> with actionable plan.</h3>
            <img className="demo-desk-img" alt="Dashboard Demo Image" src="src/assets/demo_dashboard.jpeg"/>
            <img className="demo-mobile-img" alt="Dashboard Demo Image" src="src/assets/demo_mobile.jpeg" />
            <div className="sm-row" style={{gap: 10, marginTop: 25}}>
                <Link to="/sign-up">
                    <button className="btn-primary">Take action</button>
                </Link>
                <Link target="_blank" to="https://www.instagram.com/helfy.space/">
                    <button className="btn-primary outline">No, thanks</button>
                </Link>
            </div>
        </div>
    )
}

export default Home;