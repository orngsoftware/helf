import AuthForm from "../../components/Auth";

const LoginForm = () => {
    return <AuthForm url="http://localhost/api/users/login" formType="login" />
}

export default LoginForm