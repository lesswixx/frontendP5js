// src/components/LoginForm.jsx
import { Button, Form, Input } from "@heroui/react";
import ApiService from "../api/ApiService.jsx";
import { useNavigate, NavLink } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../AuthProvider.jsx";

export default function LoginForm() {
    const navigate = useNavigate();
    const { login: markLoggedIn } = useContext(AuthContext);

    const handleLogin = async (e) => {
        e.preventDefault();
        const data = Object.fromEntries(new FormData(e.currentTarget));

        try {
            const res = await ApiService.auth.login(data);
            markLoggedIn(res.data);
            navigate("/calendar");
        } catch (err) {
            console.error("Ошибка при входе:", err);
            alert("Неверный email или пароль");
        }
    };

    return (
        <>
            {/* Кнопка «Регистрация» теперь через NavLink */}
            <Button
                className="absolute left-5 top-5"
                as={NavLink}
                to="/register"
                color="primary"
            >
                Регистрация
            </Button>

            <div className="flex justify-center items-center min-h-screen">
                <Form
                    onSubmit={handleLogin}
                    className="w-full max-w-sm flex flex-col items-center"
                >
                    <div className="w-full space-y-10">
                        <Input
                            autoComplete="on"
                            isRequired
                            type="email"
                            name="email"
                            label="Почта"
                            labelPlacement="outside"
                            placeholder="Введи почту"
                            errorMessage={({ validationDetails }) => {
                                if (validationDetails.valueMissing) return "Введи почту";
                                if (validationDetails.typeMismatch) return "Введи корректный адрес почты";
                            }}
                            classNames={{
                                base: "w-full",
                                inputWrapper: "w-full",
                                errorMessage: "absolute",
                            }}
                        />
                        <Input
                            isRequired
                            type="password"
                            name="password"
                            label="Пароль"
                            labelPlacement="outside"
                            placeholder="Введи пароль"
                            errorMessage={({ validationDetails }) => {
                                if (validationDetails.valueMissing) return "Введи пароль";
                            }}
                            classNames={{
                                base: "w-full",
                                inputWrapper: "w-full",
                                errorMessage: "absolute",
                            }}
                        />
                        <Button color="primary" type="submit">
                            Вход
                        </Button>
                    </div>
                </Form>
            </div>
        </>
    );
}
