import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

export default function CodeLab({
                                    code,
                                    setCode,
                                    executedCode,
                                    setExecutedCode,
                                    checkResult,
                                    setCheckResult,
                                    onCheck
                                }) {
    const editorRef = useRef(null);

    useEffect(() => {
        if (!editorRef.current) return;

        const view = new EditorView({
            doc: code,
            extensions: [
                basicSetup,
                javascript(),
                oneDark,
                EditorView.updateListener.of(update => {
                    if (update.docChanged) {
                        const newCode = update.state.doc.toString();
                        setCode(newCode);
                        setCheckResult(null);
                    }
                })
            ],
            parent: editorRef.current
        });

        return () => view.destroy();
    }, []);

    const handleRun = () => {
        setExecutedCode(code);

        // Очищаем и пересоздаём iframe
        const container = document.getElementById("preview-container");
        container.innerHTML = ""; // Удалить старый iframe

        const iframe = document.createElement("iframe");
        iframe.className = "w-full h-[300px] border border-purple-500 bg-black";
        container.appendChild(iframe);

        const doc = iframe.contentDocument || iframe.contentWindow?.document;
        doc.open();
        doc.write(`
      <html>
        <body style="margin:0;background:black;">
          <script src="https://cdn.jsdelivr.net/npm/p5@1.6.0/lib/p5.min.js"></script>
          <script>
            ${code}
          </script>
        </body>
      </html>
    `);
        doc.close();
    };

    return (
        <div className="flex gap-4 flex-wrap">
            {/* Редактор */}
            <div className="flex-1 min-w-[400px]">
                <h3 className="mb-2 text-white">📝 Редактор</h3>
                <div
                    ref={editorRef}
                    className="border border-purple-700 rounded-sm h-[300px] bg-[#1e1e1e] text-white"
                />
                <div className="mt-2 flex gap-3">
                    <button
                        onClick={handleRun}
                        className="bg-blue-700 hover:bg-blue-600 text-white px-4 py-1 rounded"
                    >
                        ▶️ Запустить
                    </button>

                </div>
                {checkResult && (
                    <div className="mt-2 text-sm text-white">{checkResult}</div>
                )}
            </div>

            {/* Превью */}
            <div className="min-w-[400px]">
                <h3 className="mb-2 text-white"></h3>
                <div id="preview-container" />
            </div>
        </div>
    );
}
