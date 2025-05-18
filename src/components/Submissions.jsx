import { useEffect, useState } from "react";
import ApiService from "../api/ApiService.jsx";

export default function SubmissionStatus({ assignmentId }) {
    const [submission, setSubmission] = useState(null);
    const [loading, setLoading]     = useState(true);
    const [error, setError]         = useState(null);

    useEffect(() => {
        setLoading(true);
        ApiService.submissions.my(assignmentId)
            .then(res => {
                if (res.status === 204) {
                    setSubmission(null);
                } else {
                    setSubmission(res.data);
                }
            })
            .catch(err => setError(err))
            .finally(() => setLoading(false));
    }, [assignmentId]);

    if (loading) return <div>Загрузка...</div>;
    if (error)   return <div>Ошибка: {error.message}</div>;
    if (!submission) {
        return <div className="mt-4 text-yellow-300">Вы ещё не отправляли решение.</div>;
    }

    return (
        <div className="mt-4 p-4 border border-purple-700 rounded bg-purple-900 text-white max-w-lg">
            <div><strong>Ваш ответ:</strong></div>
            <pre className="bg-gray-800 p-2 rounded overflow-auto mt-1">
        {submission.answer}
      </pre>

            <div className="mt-4">
                <strong>Оценка:</strong>{" "}
                {submission.grade != null ? submission.grade : <em>еще не оценено</em>}
            </div>
            <div className="mt-2">
                <strong>Комментарий:</strong>{" "}
                {submission.comment || <em>нет комментария</em>}
            </div>
        </div>
    );
}