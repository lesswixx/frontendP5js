// src/components/TeacherSubmissions.jsx
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CircularProgress } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import ApiService from "../api/ApiService.jsx";

export default function TeacherSubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        ApiService.submissions
            .listAll()
            .then(res => setSubmissions(res.data))
            .catch(err => {
                console.error("Ошибка при загрузке проверок:", err);
                alert("Не удалось загрузить список проверок");
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <CircularProgress size="lg" aria-label="Загрузка проверок" />
            </div>
        );
    }

    return (
        <Card className="mx-auto my-8 max-w-4xl bg-gray-900">
            <CardHeader>
                <h2 className="text-2xl font-bold text-white">
                    Список отправленных заданий
                </h2>
            </CardHeader>
            <CardBody>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-white">
                        <thead>
                        <tr className="border-b border-gray-700">
                            <th className="px-4 py-2">№</th>
                            <th className="px-4 py-2">Студент</th>
                            <th className="px-4 py-2">Задание</th>
                            <th className="px-4 py-2">Ответ</th>
                        </tr>
                        </thead>
                        <tbody>
                        {submissions.map((s, idx) => (
                            <tr
                                key={s.id}
                                className={`cursor-pointer ${
                                    idx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                                }`}
                                onClick={() => navigate(`/submissions/${s.id}`)}
                            >
                                <td className="px-4 py-2">{idx + 1}</td>
                                <td className="px-4 py-2">{s.student.username}</td>
                                <td className="px-4 py-2">{s.assignment.title}</td>
                                <td className="px-4 py-2 break-words max-w-xs">
                                    {s.answer}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </CardBody>
        </Card>
    );
}
