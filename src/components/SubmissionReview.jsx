// src/components/SubmissionReview.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardBody,
    Input,
    Textarea,
    Button,
    CircularProgress
} from "@heroui/react";
import ApiService from "../api/ApiService.jsx";

export default function SubmissionReview() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [sub, setSub] = useState(null);
    const [grade, setGrade] = useState("");
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ApiService.submissions
            .getOne(id)
            .then(res => {
                setSub(res.data);
                setGrade(res.data.grade ?? "");
                setComment(res.data.comment ?? "");
            })
            .catch(() => alert("Ошибка загрузки"))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSave = async () => {
        try {
            await ApiService.submissions.grade(id, { grade: Number(grade), comment });
            navigate("/submissions");
        } catch {
            alert("Ошибка при сохранении оценки");
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-10">
                <CircularProgress aria-label="Загрузка" />
            </div>
        );
    }

    return (
        <Card className="mx-auto my-8 max-w-md">
            <CardHeader>
                <h2 className="text-xl font-bold">Проверка задания #{id}</h2>
            </CardHeader>
            <CardBody className="space-y-4">
                <div>
                    <b>Студент:</b> {sub.student.username}
                </div>
                <div>
                    <b>Задание:</b> {sub.assignment.title}
                </div>
                <div>
                    <b>Ответ студента:</b>
                    <pre className="bg-gray-800 p-2 rounded overflow-auto">{sub.answer}</pre>
                </div>
                <Input
                    label="Оценка"
                    type="number"
                    value={grade}
                    onChange={e => setGrade(e.target.value)}
                />
                <Textarea
                    label="Комментарий"
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                />
                <div className="flex gap-4">
                    <Button color="primary" onPress={handleSave}>
                        Сохранить
                    </Button>
                    <Button variant="flat" onPress={() => navigate(-1)}>
                        Отмена
                    </Button>
                </div>
            </CardBody>
        </Card>
    );
}
