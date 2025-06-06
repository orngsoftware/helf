import './index.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Landing/Home';
import About from './pages/Landing/About';
import SignUpForm from './pages/Landing/Register';
import LoginForm from './pages/Landing/Login';
import LandingLayout from './layouts/LandingLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Plan from './pages/Dashboard/Plan';
import StartPlan from './pages/Dashboard/Start';
import BarTasksCompletion from './pages/Dashboard/Stats';
import ProductPage from './pages/Landing/Products';

const AppRoutes = () => {
    return (
        <Routes>
            <Route element={<LandingLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/sign-up" element={<SignUpForm />} />
                <Route path="/log-in" element={<LoginForm />} />
                <Route path="/products" element={<ProductPage />} />
            </Route>

            <Route element={<DashboardLayout />} >
                <Route path="/dashboard/plan/:plan_id" element={<Plan />} />
                <Route path="/start" element={<StartPlan />} />
                <Route path="/dashboard/stats" element={<BarTasksCompletion />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes;