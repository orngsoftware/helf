const ProgressBar = (props: any) => {
    const percentFill = (props.currentValue / props.maxValue) * 100
    
    return (
        <div className="progress-bar">
            <div className="progress-fill" style={{width: `${percentFill > 15 ? percentFill : 15}%`}}></div>
        </div>
    )
}

const PlanInfo = (props: any) => {
    return (
        <div>
            <h2 style={{margin: 10}}>{props.planName}</h2>
            <div className="sm-row"><ProgressBar currentValue={props.userDay} maxValue={props.planDuration}/><p className="grey-bold-info" style={{marginLeft: "20px"}}>{props.userDay}/{props.planDuration} days</p></div>
        </div>
    )
}

export default PlanInfo; ProgressBar;