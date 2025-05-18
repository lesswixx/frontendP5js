// src/App.jsx
import { Routes, Route, Navigate, Outlet, useNavigate, useHref } from "react-router-dom";
import AuthProvider, { AuthContext } from "./AuthProvider.jsx";
import Navigation      from "./components/Navigation.jsx";
import LoginForm       from "./components/LoginForm.jsx";
import RegistrationForm from "./components/RegistrationForm.jsx";
import Calendar        from "./components/Calendar.jsx";
import Assignments     from "./components/Assignments.jsx";
import TeacherSubmissions from "./components/TeacherSubmissions.jsx";
import { useContext }  from "react";
import {ThemeProvider} from "next-themes";
import {HeroUIProvider} from "@heroui/react";
import SubmissionReview from "./components/SubmissionReview.jsx";

const ProtectedRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? (
        <>
            <Navigation />
            <Outlet />
        </>
    ) : (
        <Navigate to="/login" replace />
    );
};

const PublicOnlyRoute = () => {
    const { isAuthenticated } = useContext(AuthContext);
    return isAuthenticated ? <Navigate to="/calendar" replace /> : <Outlet />;
};

export default function App() {
    const navigate = useNavigate();
    const hrefFn   = useHref();

    return (
        <HeroUIProvider navigate={navigate} useHref={hrefFn}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                <AuthProvider>
                    <Routes>
                        {/* публичные */}
                        <Route element={<PublicOnlyRoute />}>
                            <Route path="/login"    element={<LoginForm />} />
                            <Route path="/register" element={<RegistrationForm />} />
                        </Route>

                        {/* авторизованные */}
                        <Route element={<ProtectedRoute />}>
                            <Route path="/"            element={<Navigate to="/calendar" replace />} />
                            <Route path="/calendar"    element={<Calendar />} />
                            <Route path="/assignments" element={<Assignments />} />
                            <Route path="/submissions" element={<TeacherSubmissions />} />
                            <Route path="/submissions/:id" element={<SubmissionReview />} />
                        </Route>

                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </AuthProvider>
            </ThemeProvider>
        </HeroUIProvider>
    );
}
