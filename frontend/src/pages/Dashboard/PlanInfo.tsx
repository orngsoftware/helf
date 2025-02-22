import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

const ProgressBar = (props: any) => {
    const percentFill = (props.currentValue / props.maxValue) * 100
    
    return (
        <div className="progress-bar">
            <div className="progress-fill" style={{width: `${percentFill > 15 ? percentFill : 15}%`}}></div>
        </div>
    )
}

const PlanInfo = (props: any) => {
    const { plan_id } = useParams()
    const [planData, setPlanData] = useState({
        plan_name: "",
        plan_duration: ""
    })

    const fetchData = async () => {
        const apiResponse = await fetch(`http://127.0.0.1:5002/plans/get-plans?plan_id=${plan_id}`)
        const responseData = await apiResponse.json()

        setPlanData({
            plan_name: responseData.plan_name,
            plan_duration: responseData.plan_duration
        })
    }

    useEffect(() => {
        fetchData()
    },[])

    return (
        <div>
            <h2 style={{margin: 10}}>{planData.plan_name}</h2>
            <div className="sm-row"><ProgressBar currentValue={props.userDay} maxValue={planData.plan_duration}/><p className="grey-bold-info" style={{marginLeft: "20px"}}>{props.userDay}/{planData.plan_duration} days</p></div>
        </div>
    )
}

export default PlanInfo; ProgressBar;