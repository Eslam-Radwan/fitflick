import { createBrowserRouter, redirect } from "react-router-dom";
import LandingPage from '../pages/Landing/LandingPage';
import LoginPage from '../pages/Login/LoginPage';
import SignupPage from '../pages/Signup/SignupPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ProfilePage from '../pages/Profile/ProfilePage';
import GoalsPage from '../pages/Goals/GoalsPage';
import WorkoutsPage from '../pages/Workouts/WorkoutsPage';
import ProgressPage from '../pages/Progress/ProgressPage';
import AppLayout from '../components/Layout/AppLayout';
import { Navigate } from 'react-router-dom';
import { getUserToken } from "../hooks/User";


const router = createBrowserRouter([
    {
        path: "/",
        children: [
            {
                path: "/",
                Component: LandingPage,
            },
            {
                path: "/login",
                loader: () => {
                    const token = getUserToken();
                    if (token) {
                        return redirect("/app/dashboard", { replace: true });
                    }
                },
                Component: LoginPage,
            },
            {
                path: "/signup",
                Component: SignupPage,
            },
            {
                path: "/app",
                Component: AppLayout,
                loader: () => {
                    const token = getUserToken();
                    if (!token) {
                        return redirect("/login", { replace: true });
                    }
                },
                children: [
                    {
                        index: true,
                        element: <Navigate to="/app/dashboard" replace />
                    },
                    {
                        path: "/app/dashboard",
                        Component: DashboardPage,
                    },
                    {
                        path: "/app/workouts",
                        Component: WorkoutsPage,
                    },
                    {
                        path: "/app/progress",
                        Component: ProgressPage,
                    },
                    {
                        path: "/app/goals",
                        Component: GoalsPage,
                    },
                    {
                        path: "/app/profile",
                        Component: ProfilePage,
                    }
                ]
            },
            {
                path: "*",
                element: <Navigate to="/" replace />,
            }
        ]

    }
]);

export default router;

