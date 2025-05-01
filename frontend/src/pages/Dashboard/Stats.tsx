import { useEffect, useState } from "react"
import { BarChart, Bar, Legend, ResponsiveContainer, PieChart, Pie, Tooltip, Cell} from "recharts"
import { Lightning, Cloud } from "@phosphor-icons/react";

const CustomLegend = () => (
    <div style={{display: "flex", marginTop: 25 , justifyContent: "center"}}>
      <span style={{ color: "#BBE633", marginRight: 15 }}>Completed</span>
      <span style={{ color: "#FF0800" }}>Incompleted</span>
    </div>
);

const COLORS = ["#6CB4EE","#007bff", "#00B9E8", "#318CE7", "#7BAFD4"]


const TasksCompletionStats = () => {
    const [barData, setBarData] = useState([{"name": "Task completetions", "Incompleted": 0, "Completed": 0}])
    const [reasonsData, setReasonsData] = useState([{}])
    const [streakData, setStreakData] = useState({
        "streak": "",
        "longest_streak": "",
        "result": ""
    })
    const [color, setColor] = useState({"color": "#7e7e7e", "show-icon": false})

    const fetchData = async () => {
        const userStatsAPIResponse = await fetch(
            "http://localhost/api/users/stats", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
        const responseData = await userStatsAPIResponse.json()

        const streakAPIResponse = await fetch(
            "http://localhost/api/users/stats/streak", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            }
        )
        const streakResponseData = await streakAPIResponse.json()

        setStreakData(streakResponseData)
        if (streakResponseData.result == 1) {
            setColor({"color":"#FFBF00", "show-icon": true})
        }

        setBarData([
            {
                "name": "Task completetions",
                "Incompleted": responseData.non_completed_tasks,
                "Completed": responseData.completed_tasks
            }
        ])
        setReasonsData([
            {
                "name": "Boring",
                "value": responseData.reasons_with_percents["b"]
            },
            {
                "name": "Other",
                "value": responseData.reasons_with_percents["Other"]
            },
            {
                "name": "Didn't have time",
                "value": responseData.reasons_with_percents["dht"]
            },
            {
                "name": "Discipline issues",
                "value": responseData.reasons_with_percents["ned"]
            },
            {
                "name": "Too hard",
                "value": responseData.reasons_with_percents["th"]
            }
        ])
    }

    useEffect(() => {
        fetchData()
    }, [])

    if (barData[0]["Incompleted"] == 0 && barData[0]["Completed"] == 0 ) {
        return (
            <div className="plan-section">
                <div className="center-section">
                    <h1>Stats are unavailable</h1>
                    <h3>Complete some tasks and come back.</h3>
                </div>
            </div>
        )
    }

    return (
        <div className="plan-section" style={{marginTop: 50}}>
            <div className="white-card stats">
                <h3 className="sm-heading">Task Completion</h3>
                <ResponsiveContainer width="99%" height={250}>
                    <BarChart data={barData} barSize={100} barGap={50} margin={{top: 25}} >
                        <Bar dataKey="Completed" fill="#BBE633" label={{ fill: "#20222E"}} isAnimationActive={false} radius={[15, 15, 0, 0]} />
                        <Bar dataKey="Incompleted" fill="#FF0800" label={{ fill: "white"}} isAnimationActive={false} radius={[15, 15, 0, 0]} />
                        <Legend content={<CustomLegend />}/>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="white-card stats">
                <h3 className="sm-heading">Reasons for incompletion</h3>
                <ResponsiveContainer width="99%" height={250}>
                    <PieChart margin={{bottom: 15}}>
                    <Pie 
                        data={reasonsData}
                        dataKey="value" 
                        nameKey="name" 
                        cx="50%" 
                        cy="50%" 
                        outerRadius={80} 
                        fill="#007bff" 
                        label
                    >{
                        reasonsData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index]}/>
                        )
                    )
                    }</Pie>
                    <Tooltip /> 
                    <Legend verticalAlign="bottom" height={36} /> // optional
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="white-card">
                <div className="sm-row" style={{color: color.color}}>
                    <h3 className="light-text" style={{marginRight: 10}}>Current streak:</h3>
                    {color["show-icon"] ? <Lightning weight="bold" className="nav-icon"/> : <Cloud weight="bold" className="nav-icon" />}
                    <h3 className="sm-heading" style={{color: "inherit", marginLeft: 2}}>{streakData.streak}</h3>
                </div>
                <div className="sm-row">
                    <h3 className="light-text" style={{marginRight: 10}}>Longest streak:</h3>
                    <h3 className="sm-heading" style={{color: "var(--black-color)", marginLeft: 2}}>{streakData.longest_streak}</h3>
                </div>
            </div>
        </div>
    )
}

export default TasksCompletionStats;