import { Clock } from "@phosphor-icons/react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const StartPlan = () => {
    const navigate = useNavigate()
    const [message, setMessage] = useState("")

    const handleSumbit = async (e: any) => {
        const token = localStorage.getItem('token')
        e.preventDefault()
        const apiResponse = await fetch("http://localhost/api/users/start-plan?plan_id=1", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        const result = await apiResponse.json()
        setMessage(result.message)

        if (apiResponse.ok) {
            navigate("/dashboard/plan/1")
        }
    }
    return (
        <div className="center-section" style={{gap: 25}}>
            <h2>One step away.</h2>
            <div className="white-card">
                <div className="sm-row">
                    <div className="card"></div>
                    <div className="sm-col" style={{margin: 10}}>
                        <h3 className="sm-heading" style={{margin: 0}}>No diets, no bullsh*t</h3>
                        <p className="light-text" style={{marginLeft: 0, marginTop: 10}}>Improve your nutrition simpler.</p>
                        <div className="sm-row sd-item" style={{marginTop: 15}}>
                            <Clock size={18} weight="bold"/>
                            <p><span style={{fontWeight: "bold"}}>Duration:</span> X days</p>
                        </div>
                    </div>
                </div>
                <button onClick={handleSumbit} className="btn-primary">Let's start the plan!</button>
                {message && <p style={{color: "red"}}>{message}</p>}
            </div>
        </div>
    )
}

export default StartPlan;