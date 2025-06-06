import { Link } from "react-router-dom"

const ProductPage = () => {
    return (
        <div className="center-section">
            <h1>No Diets, No Bullsh*t</h1>
            <h3>Plan designed to help you improve your nutrition without unnecessary stress.</h3>
            <div className="section-row" style={{marginTop: 25, gap: 15, maxWidth: 800}}>
                <div className="white-card sm-card">
                    <h3 className="sm-heading" style={{marginLeft: 5}}>Day 1-3: What is healthy eating?</h3>
                    <p className="p-grey">What is a healthy nutrition? An overview of the aspects of diet that 
                        have the greatest impact on health and what you will be doing over the next few days.</p>
                </div>
                <div className="white-card sm-card">
                    <h3 className="sm-heading" style={{marginLeft: 5}}>Day 4-8: Expansion over restriction</h3>
                    <p className="p-grey">Restriction problem in diets. More about healthy foods and veggies. A bit on sugar.</p>
                </div>
                <div className="white-card sm-card">
                    <h3 className="sm-heading" style={{marginLeft: 5}}>Day 9-13: Plating and meal building</h3>
                    <p className="p-grey">Learn how to balance your meals without tracking macros, while keeping everything intuitive and healthy.</p>
                </div>
                <div className="white-card sm-card">
                    <h3 className="sm-heading" style={{marginLeft: 5}}>Day 14-17: Your balance, your goals/needs, your nutrition</h3>
                    <p className="p-grey">Plating is flexible. Adjust it if necessary and learn how to track your nutrition and recognise when adjustments are needed.</p>
                </div>
            </div>
            <p className="p-grey" style={{maxWidth: 700, marginTop: 40, borderTop: "2px solid var(--grey-color)", paddingTop: 15}}>17 days, 6 Helf nutrition principles, 53 tasks, all with the goal of putting you on the right track to 
                improving your nutrition with as little stress as possible — a problem that usually follows every diet.</p>
            <div className="sm-row" style={{alignItems: "center", marginTop: 25}}>
                <Link to="/sign-up">
                    <button className="btn-primary">Start plan</button>
                </Link>
                <p style={{color: "var(--blue-color)"}}>It is Free</p>
            </div>
        </div>
    )
}

export default ProductPage