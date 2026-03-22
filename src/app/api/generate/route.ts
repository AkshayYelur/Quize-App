// // src/app/api/generate/route.ts
// import OpenAI from "openai";
// import { NextResponse } from "next/server";

// export const runtime = "nodejs"; // ensure Node runtime (not edge) for env access

// type Question = {
//   question: string;
//   options: string[];
//   answerIndex: number;
//   explanation: string;
// };

// function extractJson(text: string) {
//   // tries to pull the first JSON block from a text response
//   const match = text.match(/\[\s*{[\s\S]*}\s*\]/);
//   return match ? match[0] : text;
// }

// export async function POST(req: Request) {
//   try {
//     const { topic, difficulty, count } = await req.json();

//     if (!topic || !count) {
//       return NextResponse.json(
//         { error: "Missing topic or count." },
//         { status: 400 }
//       );
//     }

//     const client = new OpenAI({
//       apiKey: process.env.OPENAI_API_KEY,
//     });

//     if (!process.env.OPENAI_API_KEY) {
//       return NextResponse.json(
//         { error: "OPENAI_API_KEY is not set on the server." },
//         { status: 500 }
//       );
//     }

//     // Ask the model for STRICT JSON
//     const system = `You generate multiple-choice quiz questions.
// Return ONLY a JSON array with no extra text.
// Each item must be:
// {
//   "question": string,
//   "options": string[4],
//   "answerIndex": number (0-3),
//   "explanation": string
// }`;

//     const user = `Create ${count} ${difficulty} quiz questions on "${topic}".
// No preface text. No markdown. Output must be a JSON array only.`;

//     // You can pick a smaller, cheaper model here
//     const completion = await client.chat.completions.create({
//       model: "gpt-4o-mini",
//       temperature: 0.7,
//       messages: [
//         { role: "system", content: system },
//         { role: "user", content: user },
//       ],
//     });

//     const raw = completion.choices?.[0]?.message?.content ?? "";
//     const jsonText = extractJson(raw);

//     let questions: Question[] = [];
//     try {
//       questions = JSON.parse(jsonText);
//     } catch (e) {
//       console.error("JSON parse failed. Raw output:", raw);
//       return NextResponse.json(
//         { error: "Failed to parse AI response. Try again." },
//         { status: 502 }
//       );
//     }

//     // basic sanity checks
//     if (!Array.isArray(questions) || questions.length === 0) {
//       return NextResponse.json(
//         { error: "AI returned no questions." },
//         { status: 502 }
//       );
//     }

//     return NextResponse.json({ questions }, { status: 200 });
//   } catch (err: any) {
//     console.error("API /api/generate error:", err);
//     return NextResponse.json(
//       { error: err?.message ?? "Server error" },
//       { status: 500 }
//     );
//   }
// }

import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type Question = {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
};

// ✅ fallback questions (20)
const fallbackQuestions: Question[] = [
  {
    question: "What is JVM?",
    options: ["Java Virtual Machine", "Java Method", "Joint VM", "None"],
    answerIndex: 0,
  },
  {
    question: "Which keyword is used for inheritance?",
    options: ["this", "super", "extends", "implements"],
    answerIndex: 2,
  },
  {
    question: "HTML stands for?",
    options: [
      "Hyper Text Markup Language",
      "High Text Machine Language",
      "None",
      "Hyper Tool Language",
    ],
    answerIndex: 0,
  },
  {
    question: "Which tag is used for paragraph?",
    options: ["<p>", "<h1>", "<div>", "<span>"],
    answerIndex: 0,
  },
  {
    question: "Which is NOT JS datatype?",
    options: ["String", "Boolean", "Float", "Undefined"],
    answerIndex: 2,
  },
  {
    question: "Which keyword declares variable in JS?",
    options: ["int", "var", "let", "Both var and let"],
    answerIndex: 3,
  },
  {
    question: "What is CSS used for?",
    options: ["Styling", "Programming", "Database", "Server"],
    answerIndex: 0,
  },
  {
    question: "SQL keyword to fetch data?",
    options: ["GET", "SELECT", "FETCH", "SHOW"],
    answerIndex: 1,
  },
  {
    question: "Which symbol is used for comments in Java?",
    options: ["//", "#", "--", "/* */"],
    answerIndex: 0,
  },
  {
    question: "Which company developed Java?",
    options: ["Microsoft", "Sun Microsystems", "Google", "IBM"],
    answerIndex: 1,
  },
  {
    question: "What is React?",
    options: ["Library", "Language", "Database", "Framework"],
    answerIndex: 0,
  },
  {
    question: "Which hook is used for state?",
    options: ["useEffect", "useState", "useRef", "useMemo"],
    answerIndex: 1,
  },
  {
    question: "HTTP method to create data?",
    options: ["GET", "POST", "PUT", "DELETE"],
    answerIndex: 1,
  },
  {
    question: "Which data structure uses FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answerIndex: 1,
  },
  {
    question: "Which data structure uses LIFO?",
    options: ["Queue", "Stack", "Array", "List"],
    answerIndex: 1,
  },
  {
    question: "Keyword to define class in Java?",
    options: ["function", "class", "define", "struct"],
    answerIndex: 1,
  },
  {
    question: "HTML tag for image?",
    options: ["<img>", "<src>", "<image>", "<pic>"],
    answerIndex: 0,
  },
  {
    question: "JS equality operator?",
    options: ["=", "==", "===", "!="],
    answerIndex: 2,
  },
  {
    question: "Which DB is relational?",
    options: ["MongoDB", "MySQL", "Firebase", "Redis"],
    answerIndex: 1,
  },
  {
    question: "Which language is backend?",
    options: ["HTML", "CSS", "Java", "Photoshop"],
    answerIndex: 2,
  },
];

function extractJson(text: string) {
  const match = text.match(/\[\s*{[\s\S]*}\s*\]/);
  return match ? match[0] : text;
}

export async function POST(req: Request) {
  try {
    const { topic, difficulty, count } = await req.json();

    if (!topic || !count) {
      return NextResponse.json(
        { error: "Missing topic or count." },
        { status: 400 }
      );
    }

    // ❌ If no API key → fallback
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ questions: fallbackQuestions });
    }

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const system = `You generate multiple-choice quiz questions.
Return ONLY JSON array.`;

    const user = `Create ${count} ${difficulty} quiz questions on "${topic}".`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.7,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content ?? "";
    const jsonText = extractJson(raw);

    let questions: Question[] = [];

    try {
      questions = JSON.parse(jsonText);
    } catch {
      // ❌ JSON error → fallback
      return NextResponse.json({ questions: fallbackQuestions });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      // ❌ Empty → fallback
      return NextResponse.json({ questions: fallbackQuestions });
    }

    return NextResponse.json({ questions });

  } catch (err: any) {
    console.error("OpenAI failed → using fallback");

    // ❌ ANY ERROR → fallback
    return NextResponse.json({ questions: fallbackQuestions });
  }
}