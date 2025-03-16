import { Check } from "@phosphor-icons/react"
import { useState } from "react"

const Tasks = (props: any) => {
    const [tasks, setTasks] = useState(props.tasks)

    async function completeTask(task_id: any, plan_id: any) {
        const response = await fetch(`http://127.0.0.1:5001/users/complete-task?plan_id=${plan_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            },
            body: JSON.stringify({"task_id": task_id})
        })
        const result = await response.json()
        console.log(result) // here in the future something will change, like when user completes task screen goes green, streak increases and etc.

        setTasks((prevTasks: any) => prevTasks.filter((task: any) => task.task_id !== task_id))
        
    }
    return (
        <div className="section-column" style={{gap: 15}}>
            <p style={{fontWeight: 600, marginLeft: 10}}>Take action today</p>
            {tasks.length === 0 ?
                (<p>You've completed everything for today!</p>) : (
                tasks.map((task: any) => (
                    <div id={`task-card${task["id"]}`} key={task["id"]} className="white-card">
                        <p style={{fontWeight: 550}}>{task["name"]}</p>
                        <p className="light-text">{task["description"]}</p>
                        <div style={{cursor: "pointer"}}onClick={() => completeTask(task["task_id"], props.planID)}><Check size={20} /></div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Tasks;