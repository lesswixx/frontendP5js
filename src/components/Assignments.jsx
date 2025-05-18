import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeLab from "./CodeLab";
import {useState, useEffect, useContext} from "react";
import {Button, CircularProgress} from "@heroui/react";
import ApiService from "../api/ApiService.jsx";
import SubmissionStatus from "./SubmissionStatus.jsx";
import {AuthContext} from "../AuthProvider.jsx";

const assignments = [
    {
        id: 1,
        title: "Введение в p5.js",
        content: `## Введение в p5.js

p5.js начинается с двух функций:

- \`setup()\` — вызывается один раз при запуске
- \`draw()\` — вызывается каждый кадр (примерно 60 раз в секунду)

Внутри \`setup()\` обычно создаём холст, а в \`draw()\` рисуем`,
        starterCode: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
}`,
        hint: "Попробуй изменить размер холста: `createCanvas(600, 400)` и установить `background(200, 200, 255)`"
    },
    {
        id: 2,
        title: "Рисование фигур",
        content: `## Рисуем фигуры

p5.js предлагает множество функций для рисования:

- \`ellipse(x, y, w, h)\`
- \`rect(x, y, w, h)\`
- \`line(x1, y1, x2, y2)\`

Фигуры рисуются в порядке вызова, от первой к последней.`,
        starterCode: `function setup() {
  createCanvas(400, 400);
  background(255);
  
  ellipse(100, 100, 80, 80);
  rect(200, 100, 80, 80);
  line(50, 300, 350, 300);
}`,
        hint: "Все координаты задаются в пикселях: `ellipse(100, 100, 50, 50)` — круг по центру (100,100)"
    },
    {
        id: 3,
        title: "Цвет и стиль",
        content: `## Цвета и стили

p5.js позволяет управлять стилем фигур:

- \`fill(r, g, b)\` — заливка
- \`stroke(r, g, b)\` — цвет линии
- \`strokeWeight(pixels)\` — толщина линии
- \`noStroke()\` / \`noFill()\` — отключить линию/заливку`,
        starterCode: `function setup() {
  createCanvas(400, 400);
  background(255);
  
  fill(255, 0, 0);
  stroke(0);
  strokeWeight(4);
  ellipse(200, 200, 100, 100);
}`,
        hint: "`fill(0, 255, 0)` — зелёная заливка. `noStroke()` убирает обводку."
    },
    {
        id: 4,
        title: "Анимация",
        content: `## Анимация

Чтобы что-то двигалось — нужно использовать переменные.

Значения можно менять в функции \`draw()\`, которая выполняется каждый кадр.`,
        starterCode: `let x = 0;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(x, 200, 50, 50);
  x += 2;
}`,
        hint: "`x += 2;` — это движение вправо. Попробуй добавить условие: если x > width, сбросить в 0."
    },
    {
        id: 5,
        title: "Ввод с мыши",
        content: `## Движение мыши

p5.js предоставляет переменные:

- \`mouseX\`, \`mouseY\` — координаты мыши
- \`mouseIsPressed\` — нажата ли кнопка мыши`,
        starterCode: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(240);
  ellipse(mouseX, mouseY, 50, 50);
}`,
        hint: "Используй `mouseIsPressed` чтобы, например, менять цвет фигуры при клике."
    },
    {
        id: 6,
        title: "Клавиатура",
        content: `## Ввод с клавиатуры

- \`keyIsDown(KEYCODE)\` — зажата ли клавиша
- \`keyPressed()\`, \`keyReleased()\` — события`,
        starterCode: `let x = 200;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  if (keyIsDown(LEFT_ARROW)) x -= 5;
  if (keyIsDown(RIGHT_ARROW)) x += 5;

  ellipse(x, 200, 50, 50);
}`,
        hint: "`LEFT_ARROW`, `RIGHT_ARROW` — это встроенные константы клавиш."
    },
    {
        id: 7,
        title: "Переменные и логика",
        content: `## Работа с переменными

p5.js использует обычный JavaScript. Вы можете:

- Объявлять переменные: \`let r = 255;\`
- Изменять их внутри draw()
- Использовать в цветах, позициях и т.д.`,
        starterCode: `let size = 50;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(255);
  ellipse(200, 200, size, size);
}`,
        hint: "Попробуй увеличить `size` со временем: `size += 1;`"
    },
    {
        id: 8,
        title: "Условия",
        content: `## Условные операторы

Вы можете использовать:

\`\`\`js
if (mouseX > 200) {
  fill(255, 0, 0);
} else {
  fill(0, 0, 255);
}
\`\`\`

Это позволяет изменять поведение по условиям.`,
        starterCode: `function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);

  if (mouseX > width / 2) {
    fill(255, 0, 0);
  } else {
    fill(0, 0, 255);
  }

  ellipse(mouseX, mouseY, 50, 50);
}`,
        hint: "`if (...)` — стандартный способ описать поведение в зависимости от условий."
    },
    {
        id: 9,
        title: "Циклы",
        content: `## Циклы

Вы можете использовать \`for\`, чтобы рисовать повторяющиеся элементы:

\`\`\`js
for (let i = 0; i < 10; i++) {
  ellipse(i * 40, 100, 30, 30);
}
\`\`\``,
        starterCode: `function setup() {
  createCanvas(400, 400);
  background(255);

  for (let i = 0; i < 10; i++) {
    ellipse(i * 40 + 20, 200, 30, 30);
  }
}`,
        hint: "Цикл `for` позволяет сгенерировать ряд фигур по шаблону."
    },
    {
        id: 10,
        title: "Мини-проект",
        content: `## Мини-проект

Используй всё, что ты узнал:

- переменные
- ввод мыши/клавиш
- фигуры и цвета
- движение и условия

Сделай что-то интересное 🎨`,
        starterCode: `let x = 200;
let y = 200;

function setup() {
  createCanvas(400, 400);
}

function draw() {
  background(220);
  ellipse(x, y, 50, 50);
}`,
        hint: "Например, добавь управление стрелками, цвет по нажатию мыши, и анимацию."
    }
];


function HintButton({ hint }) {
    const [show, setShow] = useState(false);
    return (
        <div className="mt-2">
            <button
                onClick={() => setShow(!show)}
                className="text-sm underline text-white"
            >
                {show ? "Скрыть подсказку" : "Показать подсказку"}
            </button>
            {show && <div className="mt-1 text-sm italic text-gray-300">{hint}</div>}
        </div>
    );
}

export default function Assignments() {
    const [selected, setSelected] = useState(assignments[0]);
    const [code, setCode] = useState(selected.starterCode);

    // состояние для «моей» сдачи и её загрузки
    const [submission, setSubmission] = useState(null);
    const [loadingSub, setLoadingSub] = useState(false);

    // при смене задания: подгрузить код + подгрузить свою сдачу
    useEffect(() => {
        const key = `code-task-${selected.id}`;
        const saved = localStorage.getItem(key);
        setCode(saved || selected.starterCode);

        setLoadingSub(true);
        ApiService.submissions
            .my(selected.id)
            .then((r) => setSubmission(r.data))
            .catch(() => setSubmission(null))   // если ещё не сдавали
            .finally(() => setLoadingSub(false));
    }, [selected]);

    // сохраняем код в localStorage
    useEffect(() => {
        localStorage.setItem(`code-task-${selected.id}`, code);
    }, [code, selected.id]);

    // отправка на проверку
    const handleSubmit = () => {
        ApiService.submissions
            .submit({ assignmentId: selected.id, answer: code })
            .then((r) => setSubmission(r.data))
            .catch((e) => {
                console.error(e);
                alert("Ошибка при отправке");
            });
    };

    // разметка кнопки внизу
    let bottom;
    if (loadingSub) {
        bottom = <CircularProgress aria-label="Загрузка" />;
    } else if (!submission) {
        // ещё не отправляли
        bottom = (
            <Button color="primary" onPress={handleSubmit}>
                Отправить на проверку
            </Button>
        );
    } else if (submission.grade == null) {
        // отправлено, ждём оценки
        bottom = (
            <div className="text-gray-400 italic">
                Уже отправлено — ждите оценки
            </div>
        );
    } else {
        // есть оценка
        bottom = (
            <div className="space-y-2 p-4 mt-4 bg-gray-800 rounded">
                <div>
                    <strong>Ваша оценка:</strong> {submission.grade}
                </div>
                <div>
                    <strong>Комментарий преподавателя:</strong>
                    <div className="mt-1 p-2 bg-gray-900 rounded whitespace-pre-wrap">
                        {submission.comment}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-black text-white">
            {/* боковая панель */}
            <nav className="w-60 border-r border-gray-800 p-4 bg-black">
                <h2 className="text-2xl font-bold mb-4">Курс p5.js</h2>
                <ul className="space-y-2">
                    {assignments.map((a) => (
                        <li
                            key={a.id}
                            onClick={() => setSelected(a)}
                            className={`cursor-pointer hover:text-gray-400 ${
                                selected.id === a.id
                                    ? "text-gray-200 font-semibold"
                                    : "text-gray-400"
                            }`}
                        >
                            {a.id}. {a.title}
                        </li>
                    ))}
                </ul>
            </nav>

            {/* основной блок */}
            <main className="flex-1 p-6 overflow-y-auto bg-black">
                <h1 className="text-3xl font-bold mb-4">{selected.title}</h1>

                {/* контент */}
                <div className="prose prose-invert max-w-none mb-6">
                    <Markdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ node, ...props }) => (
                                <h1 className="text-2xl font-bold mb-3" {...props} />
                            ),
                            h2: ({ node, ...props }) => (
                                <h2 className="text-xl font-semibold mb-2" {...props} />
                            ),
                            p: ({ node, ...props }) => <p className="mb-2" {...props} />,
                            ul: ({ node, ...props }) => (
                                <ul className="list-disc ml-5 mb-2" {...props} />
                            ),
                            code: ({ node, ...props }) => (
                                <code className="bg-gray-900 rounded px-1 py-0.5" {...props} />
                            ),
                        }}
                    >
                        {selected.content}
                    </Markdown>
                </div>

                <HintButton hint={selected.hint} />

                <div className="mt-6">
                    <CodeLab
                        key={selected.id}
                        code={code}
                        setCode={setCode}
                        executedCode={code}
                        setExecutedCode={() => {}}
                        checkResult={null}
                        setCheckResult={() => {}}
                        onCheck={() => {}}
                    />
                </div>

                {/* отображаем статус / кнопку / результат */}
                <div className="mt-6">{bottom}</div>
            </main>
        </div>
    );
}