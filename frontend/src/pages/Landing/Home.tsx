import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className='center-section'>
            <h1>Do you want to improve your health?</h1>
            <h3>Improve your <span style={{fontWeight: "bold"}}>nutrition simpler</span> with an actionable plan.</h3>
            <img className="demo-desk-img" alt="Dashboard Demo Image" src="src/assets/demo_dashboard.jpeg"/>
            <img className="demo-mobile-img" alt="Dashboard Demo Image" src="src/assets/demo_mobile.jpeg" />
            <div className="sm-row" style={{gap: 10, marginTop: 25, borderBottom: "2px solid var(--grey-color)", paddingBottom: 10}}>
                <Link to="/sign-up">
                    <button className="btn-primary">Take action</button>
                </Link>
                <Link target="_blank" to="https://www.instagram.com/helfy.space/">
                    <button className="btn-primary outline">No, thanks</button>
                </Link>
            </div>
            <h2 style={{marginTop: 35}}>How it works?</h2>
            <div className="section-row" style={{gap: 25, marginTop: 10}}>
                <div className="white-card sm-card">
                    <div className="sm-row">
                        <span className="circle-steps">1</span>
                        <h3 className="sm-heading" style={{marginLeft: 10}}>Read and learn</h3>
                    </div>
                    <p className="p-grey">These are called 'blocks' and they change every 3–5 days. 
                        They include cool information about nutrition, which you can 
                        learn so that the tasks and everything else make sense.</p>
                </div>
                <div className="white-card sm-card">
                    <div className="sm-row">
                        <span className="circle-steps">2</span>
                        <h3 className="sm-heading" style={{marginLeft: 10}}>Complete tasks</h3>
                    </div>
                    <p className="p-grey">Many of us are already nutrition experts, but knowing and 
                        acting are two different things, 
                        so in the 'Take Action' section, you will receive relevant and specific tasks every day.</p>
                </div>
                <div className="white-card sm-card">
                    <div className="sm-row">
                        <span className="circle-steps">3</span>
                        <h3 className="sm-heading" style={{marginLeft: 10}}>Reflect and repeat</h3>
                    </div>
                    <p className="p-grey">If you don't complete a task, you are asked why,
                    so that you are prepared to resist excuses the next day. 
                    The app also provides basic statistics in the 'Stats' tab.</p>
                </div>


            </div>

        </div>
    )
}

export default Home;