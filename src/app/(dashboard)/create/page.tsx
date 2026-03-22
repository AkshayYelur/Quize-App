// src/app/(dashboard)/create/page.tsx
"use client";

import { useState } from "react";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

export default function CreateQuizPage() {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<"Easy" | "Medium" | "Hard">("Easy");
  const [count, setCount] = useState<number>(5);

  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ correctCount: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);
    if (!topic.trim()) {
      setError("Please enter a topic.");
      return;
    }

    setLoading(true);
    setQuestions(null);
    setAnswers({});
    setResult(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, count }),
      });

      // If server returned non-JSON (HTML error page), read text and show it
      const ct = res.headers.get("content-type") || "";
      if (!res.ok) {
        // If server returned JSON error body, parse and show message
        if (ct.includes("application/json")) {
          const errJson = await res.json();
          throw new Error(errJson?.error || `Server returned ${res.status}`);
        } else {
          const text = await res.text();
          console.error("Non-JSON error response:", text);
          throw new Error(`Server error (${res.status}). See console for details.`);
        }
      }

      if (!ct.includes("application/json")) {
        // not JSON: show debug info
        const text = await res.text();
        console.error("Expected JSON but got:", text);
        throw new Error("Unexpected server response. Check server logs (console).");
      }

      const data = await res.json();

      // server should return { questions: Question[] }
      if (!data?.questions || !Array.isArray(data.questions)) {
        console.error("Bad response data:", data);
        throw new Error("AI returned invalid data. Check server logs.");
      }

      setQuestions(data.questions);
    } catch (err: any) {
      console.error("Generation error:", err);
      setError(err?.message || "Failed to generate questions");
    } finally {
      setLoading(false);
    }
  }

  function handleSelect(qIdx: number, optIdx: number) {
    setAnswers((s) => ({ ...s, [qIdx]: optIdx }));
  }

  async function handleSubmit() {
    if (!questions) return;
    const total = questions.length;
    let correctCount = 0;
    questions.forEach((q, i) => {
      if (answers[i] === q.answerIndex) correctCount++;
    });
    setResult({ correctCount, total });

    // Save to server history
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          difficulty,
          totalQuestions: total,
          correct: correctCount,
          wrong: total - correctCount,
          scorePercent: Math.round((correctCount / total) * 100),
          questions,
        }),
      });
    } catch (err) {
      console.error("Failed saving history:", err);
    }
  }

  const makeLinks = (q: Question) => {
    const query = encodeURIComponent(`${topic} ${q.question}`);
    return {
      googleScholar: `https://scholar.google.com/scholar?q=${query}`,
      youtube: `https://www.youtube.com/results?search_query=${query}`,
      web: `https://www.google.com/search?q=${query}`,
    };
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Create Quiz</h1>
      <p className="text-sm text-zinc-600">Enter a topic, select difficulty and number of questions.</p>

      <div className="card">
        <div className="grid gap-4 md:grid-cols-[1fr,160px,120px,auto] items-end">
          <div>
            <label className="label">Topic</label>
            <input className="input" placeholder="e.g., Computer Networks" value={topic} onChange={(e) => setTopic(e.target.value)} />
          </div>

          <div>
            <label className="label">Difficulty</label>
            <select className="select" value={difficulty} onChange={(e) => setDifficulty(e.target.value as any)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>

          <div>
            <label className="label">Questions</label>
            <input type="number" min={1} max={20} className="number" value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>

          <div className="flex gap-3">
            <button onClick={handleGenerate} className="btn" disabled={loading}>
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>

      {/* Questions */}
      {questions && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Questions</h2>
            <div className="text-sm text-zinc-500">{questions.length} questions</div>
          </div>

          <div className="space-y-4">
            {questions.map((q, i) => {
              const picked = answers[i];
              const submitted = !!result;
              const isCorrect = submitted && picked === q.answerIndex;
              return (
                <div key={i} className="card">
                  <div className="flex items-start gap-4">
                    <div className="w-full">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium">Q{i + 1}</div>
                        {submitted && (
                          <div className={isCorrect ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>
                            {isCorrect ? "Correct" : "Wrong"}
                          </div>
                        )}
                      </div>

                      <p className="mt-2 mb-3 text-sm">{q.question}</p>

                      <div className="grid gap-2 md:grid-cols-2">
                        {q.options.map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => !submitted && handleSelect(i, idx)}
                            className={`px-3 py-2 rounded-lg border text-sm text-left ${answers[i] === idx ? "border-blue-500 bg-blue-50" : "border-zinc-200"}`}
                            disabled={submitted}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-6 text-sm font-medium">{String.fromCharCode(65 + idx)}.</div>
                              <div className="flex-1">{opt}</div>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Resources if wrong after submit */}
                      {submitted && answers[i] !== q.answerIndex && (
                        <div className="mt-3 text-sm">
                          <div className="font-medium text-zinc-700">Study resources:</div>
                          <ul className="mt-2 space-y-1">
                            {Object.entries(makeLinks(q)).map(([k, url]) => (
                              <li key={k}>
                                <a className="link" href={url} target="_blank" rel="noreferrer">
                                  {k === "googleScholar" ? "Google Scholar" : k === "youtube" ? "YouTube" : "Web search"}
                                </a>
                              </li>
                            ))}
                          </ul>
                          {q.explanation && <p className="mt-2 text-sm text-zinc-600">Explanation: {q.explanation}</p>}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button className="btn" onClick={handleSubmit}>
              Submit Test
            </button>
          </div>

          {result && (
            <div className="card">
              <h3 className="font-semibold">Result</h3>
              <p className="mt-2">
                Score: <strong>{result.correctCount}/{result.total}</strong> ({Math.round((result.correctCount / result.total) * 100)}%)
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
