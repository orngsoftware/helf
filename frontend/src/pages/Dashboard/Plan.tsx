import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Block from "./Block";
import PlanInfo from "./PlanInfo";
import Tasks from "./Tasks";

const Plan = () => {
    const { plan_id } = useParams();
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const request_data = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
    const [allData, setAllData] = useState({
        current_user_day: "",
        current_user_block: "",
        user_name: "",
        user_tasks_completed: [],
        plan_duration: "",
        plan_name: "",
        block_name: "",
        tldr_info: "",
        body_info: "",
        time_info: "",
        tasks: []
    })

    const fetchData = async () => {
        // 1. Fetch User data
        const userAPIResponse = await fetch(
            `http://127.0.0.1:5001/users/user-plan?plan_id=${plan_id}`,
            request_data
        );
        const userResponseData = await userAPIResponse.json();
        if (userAPIResponse.status == 401) {
            localStorage.removeItem("token")
            navigate("/log-in")
        }

        // 2. Fetch Plan data
        const planAPIResponse = await fetch(
            `http://127.0.0.1:5002/plans?plan_id=${plan_id}`
        );
        const planResponseData = await planAPIResponse.json();

        // 3. Fetch Block data
        const blockAPIResponse = await fetch(
            `http://127.0.0.1:5002/plans/block-data?plan_id=${plan_id}&block_id=${userResponseData.current_block_num}`,
            request_data
        );
        const blockResponseData = await blockAPIResponse.json();

        // 4. Fetch Tasks data
        const userCompletedTasks = userResponseData.tasks_completed.join("t");
        const tasks_query = userCompletedTasks ? `&tasks=${userCompletedTasks}` : "";
        const tasksAPIResponse = await fetch(
            `http://127.0.0.1:5002/plans/tasks?plan_id=${plan_id}&day=1${tasks_query}`, // Change day=1 to day={user.current_day} on real data
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const taskResponseData = await tasksAPIResponse.json();

        return ({
            current_user_day: userResponseData.current_day,
            current_user_block: userResponseData.current_block_num,
            user_name: userResponseData.user_name,
            user_tasks_completed: userResponseData.tasks_completed,
            plan_duration: planResponseData.plan_duration,
            plan_name: planResponseData.plan_name,
            block_name: blockResponseData.block_name,
            tldr_info: blockResponseData.tldr_info,
            body_info: blockResponseData.body_info,
            time_info: blockResponseData.time_info,
            tasks: taskResponseData
        })
    };

    useEffect(() => {
        const getData = async () => {
            const data = await fetchData()
            setAllData(data)

        }
        getData()
    }, [plan_id]);

    console.log("SHFEUHGUEH", allData)

    if (allData.current_user_block) {
        return (
            <div className="plan-section">
                <div className="section-column">
                    <h1><span style={{fontWeight: "lighter"}}>Hello,</span> {allData.user_name}.</h1>
                    <PlanInfo
                        userDay={allData.current_user_day}
                        planName={allData.plan_name}
                        planDuration={allData.plan_duration}
                    />
                    <Block
                        blockName={allData.block_name}
                        tldrInfo={allData.tldr_info}
                        bodyInfo={allData.body_info}
                        timeInfo={allData.time_info}
                    />
                </div>
                <Tasks tasks={allData.tasks} planID={plan_id}/>
            </div>
        )
    }

    else {
        return (
            <div>Loading...</div>
        );
    }
}

export default Plan;