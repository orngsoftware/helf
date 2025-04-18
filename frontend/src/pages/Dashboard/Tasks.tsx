import { Check, X } from "@phosphor-icons/react"
import { useState } from "react"

const TaskReflection = (props: any) => {
    const [selected, setSelected] = useState(null)
    const [note, setNote] = useState("")

    const handleChagne = (value: any) => {
        setSelected(value)
        switch (value) {
            case "th":
                setNote("*Nobody has said that it is easy. But have you tried your best?")
                break;
            case "dht":
                setNote("*“It's not that we have a short time to live, but that we waste a lot of it.“ - Seneca. Perhaps it's not too late to do it now?")
                break;
            case "b":
                setNote("*Would the future you regret skipping this just because it wasn’t exciting?")
                break;
            case "ned":
                setNote("*You had the freedom to decide today. Will you have the strength to decide differently tomorrow?")
            }
    }       

    const handleSumbit = async (e: any) => {
        e.preventDefault()

        const csrfResponse = await fetch("http://127.0.0.1:5001/get-csrf-token")
        const csrfData = await csrfResponse.json()
        const csrfToken = csrfData.csrf_token

        const response = await fetch("http://127.0.0.1:5001/users/incomplete-task", {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("token")}`,
                "X-CSRFToken": csrfToken
            },
            body: JSON.stringify({"reason": selected ? selected : "Other"})
        })
        const result = await response.json()
        console.log(result)
        
    }

    return (
        <div className="popup-overlay">
            <div className="white-card popup">
                <div style={{cursor: "pointer"}} onClick={props.togglePopup} className="to-top-right"><X weight="bold" size={20} /></div>
                <h3 className="sm-heading" style={{marginTop: "30px"}}>Why you didn't <span style={{color: "#007bff"}}>{props.taskDescription}</span>?</h3>
                <form onSubmit={handleSumbit} style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <div className="sm-row tr-form">
                        <label className="tr-reasons" style={{ backgroundColor: selected === "th" ? "var(--light-grey-color)" : "var(--black-color)"}}>
                            <input name="reason" type="radio" id="th" value="th" onChange={() => handleChagne("th")}/>
                            <p className="tr-label">Too hard</p>
                        </label>
                        <label className="tr-reasons" style={{ backgroundColor: selected === "b" ? "var(--light-grey-color)" : "var(--black-color)"}}>
                            <input name="reason" type="radio" id="b" value="b" onChange={() => handleChagne("b")}/>
                            <p className="tr-label">Boring</p>
                        </label>
                        <label className="tr-reasons" style={{ backgroundColor: selected === "dht" ? "var(--light-grey-color)" : "var(--black-color)"}}>
                            <input name="reason" type="radio" id="dht" value="dht" onChange={() => handleChagne("dht")}/>
                            <p className="tr-label">Didn't have time</p>
                        </label>
                        <label className="tr-reasons" style={{ backgroundColor: selected === "ned" ? "var(--light-grey-color)" : "var(--black-color)"}}>
                            <input name="reason" type="radio" id="ned" value="ned" onChange={() => handleChagne("ned")}/>
                            <p className="tr-label">Not enough discipline</p>
                        </label>
                    </div>
                    {note && <p style={{margin: "20px", color: "#7e7e7e"}}>{note}</p>}
                    <div className="sm-row" style={{marginTop: 10, gap: "10px", borderTop: "1px solid #bebebe", paddingTop: "10px"}}>
                        <button type="submit" className="btn-primary">Incomplete</button>
                        <button className="btn-primary outline" onClick={props.togglePopup}>Or maybe not?</button>
                    </div>
                </form>
            </div>
        </div>
    )
}

const Tasks = (props: any) => {
    const [tasks, setTasks] = useState(props.tasks)
    const [isOpen, setOpen] = useState(false)

    const showReflection = () => {
        setOpen(!isOpen)
    }
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
        console.log(result) // here in the future something will change, like when user completes a task screen goes green.
        if (result.streak_change == 1) {
            props.planCallback(true)
        }

        setTasks((prevTasks: any) => prevTasks.filter((task: any) => task.task_id !== task_id))
    }

    return (
        <div className="tasks-section">
            <h3 className="sm-heading">Take action today</h3>
            {tasks.length === 0 ?
                (<p>You've completed everything for today!</p>) : (
                tasks.map((task: any) => (
                    <div id={`task-card${task["id"]}`} key={task["id"]} className="white-card">
                        {isOpen && <TaskReflection togglePopup={showReflection} taskDescription={task["description"]}/>}
                        <p style={{fontWeight: 550}}>{task["name"]}</p>
                        <p className="light-text">{task["description"]}</p>
                        <div className="sm-row" style={{gap: 20}}>
                            <div style={{cursor: "pointer"}}onClick={() => completeTask(task["task_id"], props.planID)}><Check weight="bold" size={20} color="#9DF53A" /></div>
                            <div style={{cursor: "pointer"}} onClick={showReflection}><X weight="bold" size={20} color="red" /></div>
                        </div>
                    </div>
                ))
            )}
        </div>
    )
}

export default Tasks;