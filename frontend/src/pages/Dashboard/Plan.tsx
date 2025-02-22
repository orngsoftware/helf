import { useParams } from "react-router-dom"
import Block from "./Block"
import PlanInfo from "./PlanInfo"
import { useEffect, useState } from "react"

const Plan = () => {
    const { plan_id } = useParams()
    const [userData, setUserData] = useState({
        current_user_day: "",
        current_block_num: ""
    })
    
    const request_data = {method: 'GET', headers: {'Authorization': `Bearer ${localStorage.getItem("token")}`}}
    const fetchUserData = async () => {
        const userAPIResponse = await fetch(`http://127.0.0.1:5001/users/get-user-plan?plan_id=${plan_id}`, request_data)
        const responseData = await userAPIResponse.json()

        setUserData({
            current_user_day: responseData.current_day,
            current_block_num: responseData.current_block_num
        })
    }

    useEffect(() => {
        fetchUserData()
    }, [])
    
    return (
        <div className="section-column">
            <PlanInfo userDay={userData.current_user_day}/>
            <Block plan_id={plan_id} current_block_num={userData.current_block_num}/>
        </div>
    )
}

export default Plan;