import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const AuthForm = (props: any) => {
    const {url, formType} = props
    const navigate = useNavigate()

    const [formData, setFormData] = useState({  
        name: "",
        email: "",
        password: ""
    })
    const [message, setMessage] = useState("")

    const handleChagne = (e: any) => {
        const {name, value} = e.target
        setFormData({...formData, [name]: value})
    }

    const handleSumbit = async (e: any) => {
        e.preventDefault()
        setMessage("")

        try {
            // Fetch CSRF token
            const csrfResponse = await fetch("http://localhost/api/users/get-csrf-token")
            const csrfData = await csrfResponse.json()
            const csrfToken = csrfData.csrf_token

            const requestBody = formType === "register" ? formData : {email: formData.email, password: formData.password}

            const response = await fetch(url, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken
                },
                body: JSON.stringify(requestBody)
            })

            const result = await response.json()

            if (response.ok) {
                localStorage.removeItem("token") // Remove already existing tokens in case user tries to login again.
                localStorage.removeItem("refresh_token")
                localStorage.setItem("token", result.token)
                localStorage.setItem("refresh_token", result.refresh_token)
                if (formType === "register") {
                    navigate("/start")
                }
                else {
                    navigate("/dashboard/plan/1")
                }
            }
            setMessage(result.message)

        } 
        catch(error) {
            setMessage("500, Connection to server error.")
        }
    }
    return (
        <div className="center-section">
            <Link to="/" style={{alignSelf: "flex-start", marginLeft: "75px"}}><img className="logo-img auth-logo" src="./src/assets/logowithname.png" alt="Helf Logo"></img></Link>
            <h1>{formType === "register" ? "Welcome to Helf": "Welcome back"}</h1>
            <form onSubmit={handleSumbit} className="auth-form" autoComplete="off">
                {formType === "register" && (
                <>
                    <label>Name</label>
                    <input 
                        type="text"
                        name="name"
                        placeholder="What's your name?"
                        value={formData.name}
                        onChange={handleChagne}
                        required
                    />
                </>
                )}
                <label>Email</label>
                <input 
                    type="email"
                    name="email"
                    placeholder="Type your email"
                    value={formData.email}
                    onChange={handleChagne}
                    required
                />
                <label>Password</label>
                <input 
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChagne}
                    required
                />
                <button type="submit" className="submit-btn">{formType === "register" ? "Continue with email" : "Log in"}</button>
                {message && <p style={{color: "red"}}>{message}</p>}
            </form>
        </div>
    )
}

export default AuthForm;