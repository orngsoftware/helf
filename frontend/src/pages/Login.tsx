import AuthForm from "../components/AuthForm";

const LoginForm = () => {
    return <AuthForm url="http://127.0.0.1:5001/users/login" formType="login" />
}

export default LoginForm