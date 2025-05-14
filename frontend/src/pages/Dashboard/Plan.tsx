import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Block from "./Block";
import PlanInfo from "./PlanInfo";
import Tasks from "./Tasks";
import Finish from "./Finish";

const Plan = () => {
    const {plan_id} = useParams();
    const navigate = useNavigate();

    const [allData, setAllData] = useState({
        current_user_day: "",
        user_name: "",
        user_tasks_completed: [],
        user_streak: "",
        longest_streak: "",
        streak_update_result: "",
        plan_duration: "",
        plan_name: "",
        block_name: "",
        tldr_info: "",
        body_info: "",
        time_info: "",
        tasks: []
    })

    const [streakUpdated, setStreakUpdated] = useState(false)
    const tasksHandleCallback = (tasksData: boolean) => {
        setStreakUpdated(tasksData)
    }

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const request_data = {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        //1.Fetch User data
        const userAPIResponse = await fetch(
            `http://localhost/api/users/user-plan?plan_id=${plan_id}`,
            request_data
        );
        const streakAPIReposnse = await fetch(
            'http://localhost/api/users/stats/streak',
            request_data 
        )
        const streakReponseData = await streakAPIReposnse.json();
        const userResponseData = await userAPIResponse.json();
        
        //Refresh JWT if needed
        if (userAPIResponse.status == 401) {
            localStorage.removeItem("token")
            const refreshAPIResponse = await fetch(
                'http://localhost/api/users/refresh',
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({refresh_token: localStorage.getItem("refresh_token")})
                }
            )
            const refreshAPIdata = await refreshAPIResponse.json()
            if (refreshAPIResponse.ok) {
                localStorage.setItem("token", refreshAPIdata.token)
                return await fetchData()
            } else {
                alert("Session expired.")
                navigate("/log-in")
            }
        }

        //2.Fetch Plan data
        const planAPIResponse = await fetch(
            `http://localhost/api/plans?plan_id=${plan_id}`
        );
        const planResponseData = await planAPIResponse.json();

        //3.Fetch Block data
        const blockAPIResponse = await fetch(
            `http://localhost/api/plans/block-data?plan_id=${plan_id}&day=${userResponseData.current_day}`,
            request_data
        );
        const blockResponseData = await blockAPIResponse.json();

        //4.Fetch Tasks data
        const tasks_query = userResponseData.tasks_saved ? `&tasks=${userResponseData.tasks_saved.join("t")}` : "";
        const tasksAPIResponse = await fetch(
            `http://localhost/api/plans/tasks?plan_id=${plan_id}&day=${userResponseData.current_day}${tasks_query}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        const taskResponseData = await tasksAPIResponse.json();

        return ({
            current_user_day: userResponseData.current_day,
            user_name: userResponseData.user_name,
            user_tasks_completed: userResponseData.tasks_completed,
            user_streak: streakReponseData.streak,
            longest_streak: streakReponseData.longest_streak,
            streak_update_result: streakReponseData.result,
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
    }, [plan_id, streakUpdated]);

    if (allData.current_user_day) {
        if (allData.current_user_day >= allData.plan_duration) {
            return <Finish userName={allData.user_name} />
        }
        return (
            <div className="plan-section">
                <div className="section-column">
                    <h1><span style={{fontWeight: "lighter"}}>Hello,</span> {allData.user_name}.</h1>
                    <PlanInfo
                        userDay={allData.current_user_day}
                        planName={allData.plan_name}
                        planDuration={allData.plan_duration}
                        userStreak={allData.user_streak}
                        streakUpdate={allData.streak_update_result}
                    />
                    <Block
                        blockName={allData.block_name}
                        tldrInfo={allData.tldr_info}
                        bodyInfo={allData.body_info}
                        timeInfo={allData.time_info}
                    />
                </div>
                <Tasks tasks={allData.tasks} planID={plan_id} planCallback={tasksHandleCallback} />
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