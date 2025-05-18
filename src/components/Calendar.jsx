// src/components/Calendar.jsx
import { useEffect, useState } from "react";
import { getWeek, startOfWeek, endOfWeek, format, addWeeks, subWeeks } from "date-fns";
import { Button, Card, CardBody, CircularProgress } from "@heroui/react";
import ApiService from "../api/ApiService.jsx";

// helper: форматируем дату диапазона «8 – 14 апреля»
const formatRange = (date) => {
    const start = format(startOfWeek(date, { weekStartsOn: 1 }), "d MMMM");
    const end   = format(endOfWeek(date,   { weekStartsOn: 1 }), "d MMMM");
    return `${start} – ${end}`;
};

export default function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [events, setEvents]           = useState([]);
    const [loading, setLoading]         = useState(false);

    // загрузка событий для выбранной недели
    const fetchWeekEvents = async (date) => {
        setLoading(true);
        const weekNumber = getWeek(date, { weekStartsOn: 1 });
        try {
            const resp = await ApiService.events.getByWeek(weekNumber); // GET /api/events?week=...
            setEvents(resp.data);                                       // [{ id,title,date,desc }, ...]
        } catch (err) {
            console.error("Ошибка при получении событий:", err);
            setEvents([]);
        } finally {
            setLoading(false);
        }
    };

    // начальная загрузка + при смене currentDate
    useEffect(() => {
        fetchWeekEvents(currentDate);
    }, [currentDate]);

    // навигация по неделям
    const prevWeek = () => setCurrentDate((d) => subWeeks(d, 1));
    const nextWeek = () => setCurrentDate((d) => addWeeks(d, 1));
    const thisWeek = () => setCurrentDate(new Date());

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            {/* ↔︎ панель навигации по неделям */}
            <div className="flex items-center justify-between bg-purple-800/20 rounded-lg p-4">
                <Button size="sm" color="secondary" variant="flat" onPress={prevWeek}>
                    ← Неделя назад
                </Button>
                <h2 className="text-xl font-semibold">
                    {formatRange(currentDate)} <span className="text-purple-500">({getWeek(currentDate)})</span>
                </h2>
                <div className="flex gap-2">
                    <Button size="sm" color="secondary" variant="flat" onPress={thisWeek}>
                        Текущая
                    </Button>
                    <Button size="sm" color="secondary" variant="flat" onPress={nextWeek}>
                        Неделя вперёд →
                    </Button>
                </div>
            </div>

            {/* список событий */}
            {loading ? (
                <div className="flex justify-center py-10">
                    <CircularProgress size="lg" aria-label="Loading..." color="secondary" />
                </div>
            ) : events.length === 0 ? (
                <p className="text-center text-gray-400">Событий нет</p>
            ) : (
                <div className="space-y-4">
                    {events.map((evt) => (
                        <Card key={evt.id}>
                            <CardBody>
                                <h3 className="font-bold text-lg mb-1">{evt.title}</h3>
                                <p className="text-sm text-gray-400">{format(new Date(evt.date), "d MMMM, HH:mm")}</p>
                                {evt.description && <p className="mt-2">{evt.description}</p>}
                            </CardBody>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
