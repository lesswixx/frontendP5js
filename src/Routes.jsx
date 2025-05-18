import useStore from "./Store.jsx";
import { Navigate, Outlet } from "react-router-dom";
import { CircularProgress } from "@heroui/react";
import Navigation from "./components/Navigation.jsx";

// ProtectedRoute – only render if user is authenticated
export function ProtectedRoute() {
    const { curUser, authChecked, isLoading } = useStore();

    // While auth status is being checked or any loading is in progress, show a loader
    if (!authChecked || isLoading) {
        return <CircularProgress size="lg" aria-label="Loading..." color="secondary" />;
    }

    // If not authenticated, redirect to login
    if (!curUser) {
        return <Navigate to="/login" replace />;
    }

    // If authenticated, render the navigation bar and the protected component(s)
    return (
        <>
            <Navigation />
            <div className="p-8">
                <Outlet />
            </div>
        </>
    );
}

// PublicOnlyRoute – only render if user is NOT authenticated
export function PublicOnlyRoute() {
    const { curUser, authChecked, isLoading } = useStore();

    if (!authChecked || isLoading) {
        // If auth check not done (or loading), don’t render anything yet (to prevent flicker)
        return null;
    }
    // If user is logged in, redirect to the calendar (home) page
    if (curUser) {
        return <Navigate to="/calendar" replace />;
    }
    // Otherwise, render the public component (login or register form)
    return <Outlet />;
}
