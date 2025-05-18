// src/components/Navigation.jsx
import {
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    Button
} from "@heroui/react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";
import ThemeSwitcher from "./ThemeSwitcher.jsx";

export default function Navigation() {
    const { isAuthenticated, logout, currentUser } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const roles = currentUser?.roles ?? [];

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <Navbar
            maxWidth="full"
            height="64px"
            className="sticky top-0 z-50 bg-purple-950/90 backdrop-blur-md"
            isBordered
        >
            <NavbarBrand>
                <span className="text-white text-2xl font-bold">Code</span>
                <span className="text-purple-400 text-2xl font-bold">Hub</span>
            </NavbarBrand>

            {isAuthenticated && (
                <NavbarContent justify="center" className="hidden md:flex gap-6">
                    <NavbarItem isActive={location.pathname === "/calendar"}>
                        <NavLink
                            to="/calendar"
                            className="text-white hover:text-purple-300"
                        >
                            Календарь
                        </NavLink>
                    </NavbarItem>
                    <NavbarItem isActive={location.pathname === "/assignments"}>
                        <NavLink
                            to="/assignments"
                            className="text-white hover:text-purple-300"
                        >
                            Задания
                        </NavLink>
                    </NavbarItem>
                    {roles.includes("TEACHER") && (
                        <NavbarItem isActive={location.pathname === "/submissions"}>
                            <NavLink to="/submissions">Проверки</NavLink>
                        </NavbarItem>
                    )}
                </NavbarContent>
            )}

            <NavbarContent justify="end" className="items-center gap-4">
                <ThemeSwitcher />
                {isAuthenticated ? (
                    <Button
                        color="danger"
                        variant="flat"
                        size="sm"
                        onPress={handleLogout}
                    >
                        Выйти
                    </Button>
                ) : (
                    <Button
                        as="a"
                        href="/login"
                        color="secondary"
                        size="sm"
                    >
                        Войти
                    </Button>
                )}
            </NavbarContent>
        </Navbar>
    );
}
