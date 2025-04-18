import { Cloud, Lightning } from "@phosphor-icons/react"
import { useEffect, useState } from "react"

const ProgressBar = (props: any) => {
    const percentFill = (props.currentValue / props.maxValue) * 100
    
    return (
        <div className="progress-bar">
            <div className="progress-fill" style={{width: `${percentFill > 15 ? percentFill : 15}%`}}></div>
        </div>
    )
}

const PlanInfo = (props: any) => {
    const [color, setColor] = useState({"color": "#7e7e7e", "show-icon": false})

    useEffect(() => {
        if (props.streakUpdate == 1) {
            setColor({"color":"#FFBF00", "show-icon": true})
        }
    }, [props.streakUpdate])

    return (
        <div>
            <div className="sm-row">
                <h2 style={{margin: 10}}>{props.planName}</h2>
                <div className="sm-row to-right" style={{color: color.color}}>
                    {color["show-icon"] ? <Lightning weight="bold" className="nav-icon"/> : <Cloud weight="bold" className="nav-icon" />}
                    <h3 className="sm-heading" style={{color: "inherit", marginLeft: 2}}>{props.userStreak}</h3>
                </div>
            </div>
            <div className="sm-row"><ProgressBar currentValue={props.userDay} maxValue={props.planDuration}/><p className="grey-bold-info" style={{marginLeft: "20px"}}>{props.userDay}/{props.planDuration} days</p></div>
        </div>
    )
}

export default PlanInfo; ProgressBar;