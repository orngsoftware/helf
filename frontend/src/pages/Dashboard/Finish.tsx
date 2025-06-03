const Finish = (props: any) => {
    return (
        <div className="plan-section finish">
            <div className="section-column">
                <h1 style={{marginBottom: 10}}>Congratulations, {props.userName}.</h1>
                <h3 style={{marginBottom: 10}}>You have finished No Diets, No Bullsh*t plan.</h3>
                <div className="white-card">
                    <p>I believe it was a quick but pretty intense plan, 
                        and hopefully you've achieved the goal of this plan: <span style={{fontWeight: "bold"}}>to get on the right track to improving 
                            your health, specifically your nutrition</span>. This will lead you to better habits and, consequently, better health and 
                            well-being. The goal wasn't to change your nutrition completely in 17 days; rather, it was to create the right direction, 
                            unbiased towards diets that would cause the loop discussed at the beginning of the plan. The goal was 
                            to build a healthy relationship with healthy eating, not to restrict yourself to the point where you want to do nothing but 
                            binge on sweets, and I know you've achieved that, right? If not, that's okay, because there are two options: 
                            1) If you haven't made any changes and have perhaps done very little, you can start again or contact me and 
                            I will suggest some things you could try. 2) If you feel tense or stressed by the restrictions, or are feeling overwhelmed, 
                            it means that you have pushed yourself too hard and now it is time to relax, eat some of your favourite foods, try cooking 
                            something new, stop tracking everything and everywhere, and try out some new foods that aren't necessarily "healthy".<br></br><br></br>
                            And actually there is a third option, that this plan is shit, yeah, that I've completely screwed it up, 
                        and in this case you can send a feedback, preferably an objective one, to this email: <a href="mailto: while.no.helf@gmail.com" style={{"color": "#007bff"}}>while.no.helf@gmail.com</a>
                        <br></br><br></br><span style={{fontStyle: "italic"}}>The key principles of Helfy nutrition are listed below, so you always know what to do.</span> ⬇️
                        </p>
                </div>
                <h3 className="sm-heading">Helfy principles</h3>
                <div className="section-row" style={{gap: 15, minHeight: 175}}>
                    <div className="white-card princ">
                        <p>
                        <span style={{fontWeight: "bold"}}>Eat nutrient-dense foods</span><br></br>
                        Eat minimally or unprocessed foods and try to choose those that are relatively high in nutrients compared to calories.
                        </p>
                    </div>
                    <div className="white-card princ">
                        <p>
                        <span style={{fontWeight: "bold"}}>Eat fruits and vegetables</span><br></br>
                        Eat 2–3 portions of fruit and vegetables (focusing on vegetables).
                        </p>
                    </div>
                    <div className="white-card princ">
                        <p>
                        <span style={{fontWeight: "bold"}}>Plate method</span><br></br>
                        Balance your meal by imagining a plate (or using a physical plate) and dividing it into three sections: 25% - Protein, 30% - Carbs,
                        45% - Fruits & Vegetables. The goal is eat to balanced meals overall throughout the day, so don't be too strict.
                        </p>
                    </div>
                    <div className="white-card princ">
                        <p>
                        <span style={{fontWeight: "bold"}}>Expansion over restriction</span><br></br>
                        Don't restrict yourself and give up on foods which you love, instead try adding more nutrient-dense foods, vegetables and fruits, try
                        to balance it all up and expand your nutrition.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Finish;