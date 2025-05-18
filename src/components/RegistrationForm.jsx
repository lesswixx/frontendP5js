import { useState } from "react";
import { Button, Form, Input, Link } from "@heroui/react";
import AvatarUpload from "./AvatarUpload.jsx";
import ApiService from "../api/ApiService.jsx";
import { useNavigate } from "react-router-dom";

export default function RegistrationForm() {
    const [password, setPassword] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");
    const navigate = useNavigate();

    const getPasswordError = (value) => {
        if (value.length < 8) {
            return "Не менее 8 символов";
        }
        if ((value.match(/[A-Z]/g) || []).length < 1) {
            return "Не менее 1 заглавной буквы";
        }
        if ((value.match(/[^a-z]/gi) || []).length < 1) {
            return "Не менее 1 символа";
        }
        return true;
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        const formEntries = new FormData(e.currentTarget);
        const data = Object.fromEntries(formEntries);
        console.log("Register form data:", data);
        try {
            await ApiService.auth.register(
                {
                    username: data.username,
                    email: data.email,
                    firstName: data.firstName,
                    lastName: data.lastName,
                    password: data.password,
                    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
                },
                data.avatar  // avatar file (if any)
            );
            await ApiService.auth.login({ email: data.email, password: data.password });
            await ApiService.users.getCurrentUser();
            navigate("/calendar");
            window.location.reload();
        } catch (error) {
            console.error("Ошибка при регистрации:", error);
        }
    };

    const handleReset = () => {
        // Reset form state
        setPassword("");
        setAvatarUrl("");
    };

    return (
        <>
            {/* Link to login page */}
            <Button className="absolute left-5 top-5" as={Link} href="/login" color="primary">
                Вход
            </Button>
            <div className="flex justify-center items-center min-h-screen">
                <Form
                    className="w-full max-w-xl flex flex-col items-center"
                    onSubmit={handleRegister}
                    onReset={handleReset}
                >
                    {/* Avatar upload component */}
                    <div className="flex justify-center mb-8">
                        <AvatarUpload value={avatarUrl} onChange={setAvatarUrl} />
                    </div>

                    {/* Registration fields */}
                    <div className="w-full space-y-6">
                        {/* Block 1: First Name and Last Name */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <Input
                                    autoComplete="on"
                                    isRequired
                                    name="firstName"
                                    label="Имя"
                                    labelPlacement="outside"
                                    placeholder="Введи свое имя"
                                    errorMessage={({ validationDetails }) => {
                                        if (validationDetails.valueMissing) return "Введи свое имя";
                                    }}
                                    classNames={{
                                        base: "w-full",
                                        inputWrapper: "w-full",
                                        errorMessage: "absolute"
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    autoComplete="on"
                                    isRequired
                                    name="lastName"
                                    label="Фамилия"
                                    labelPlacement="outside"
                                    placeholder="Введи свою фамилию"
                                    errorMessage={({ validationDetails }) => {
                                        if (validationDetails.valueMissing) return "Введи свою фамилию";
                                    }}
                                    classNames={{
                                        base: "w-full",
                                        inputWrapper: "w-full",
                                        errorMessage: "absolute"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Block 2: Email and Username */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <Input
                                    autoComplete="on"
                                    isRequired
                                    type="email"
                                    name="email"
                                    label="Почта"
                                    labelPlacement="outside"
                                    placeholder="example@domain.com"
                                    errorMessage={({ validationDetails }) => {
                                        if (validationDetails.valueMissing) return "Введи почту";
                                        if (validationDetails.typeMismatch) return "Введи корректный адрес почты";
                                    }}
                                    classNames={{
                                        base: "w-full",
                                        inputWrapper: "w-full",
                                        errorMessage: "absolute"
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    autoComplete="on"
                                    isRequired
                                    name="username"
                                    label="Username"
                                    labelPlacement="outside"
                                    placeholder="Имя пользователя"
                                    errorMessage={({ validationDetails }) => {
                                        if (validationDetails.valueMissing) return "Придумай username";
                                    }}
                                    classNames={{
                                        base: "w-full",
                                        inputWrapper: "w-full",
                                        errorMessage: "absolute"
                                    }}
                                />
                            </div>
                        </div>

                        {/* Block 3: Password and Password Confirmation (or other fields) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="w-full">
                                <Input
                                    isRequired
                                    type="password"
                                    name="password"
                                    label="Пароль"
                                    labelPlacement="outside"
                                    placeholder="Придумай пароль"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    validation={getPasswordError}
                                    errorMessage={({ value }) => getPasswordError(value) || "" }
                                    classNames={{
                                        base: "w-full",
                                        inputWrapper: "w-full",
                                        errorMessage: "absolute"
                                    }}
                                />
                            </div>
                            <div className="w-full">
                                <Input
                                    // Example second password field for confirmation (if needed)
                                    // isRequired
                                    // type="password"
                                    // name="passwordConfirm"
                                    // label="Повторите пароль"
                                    // labelPlacement="outside"
                                    // placeholder="Повтори пароль"
                                    // validation={(val) => val === password || "Пароли не совпадают"}
                                    // (If not doing confirm password, you can remove this second input.)
                                />
                            </div>
                        </div>

                        {/* Submit and reset buttons */}
                        <div className="flex justify-between mt-4">
                            <Button type="reset" color="default">Очистить</Button>
                            <Button type="submit" color="primary">Зарегистрироваться</Button>
                        </div>
                    </div>
                </Form>
            </div>
        </>
    );
}
