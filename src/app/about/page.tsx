// src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="page-title">About QuizMaster AI</h1>

      <section className="card">
        <h3 className="font-semibold">What is this project?</h3>
        <p className="subtle mt-2">An AI-powered quiz generator that creates personalized quizzes with instant grading and analytics.</p>
      </section>

      <section className="card">
        <h3 className="font-semibold">How it works</h3>
        <ul className="mt-2 list-disc ml-5 text-sm text-zinc-600">
          <li>Provide a topic and difficulty.</li>
          <li>AI generates questions and answers.</li>
          <li>Users take the quiz, get instant feedback, and track progress.</li>
        </ul>
      </section>

      <section className="card">
        <h3 className="font-semibold">Future scope</h3>
        <p className="text-sm text-zinc-600 mt-2">Add user accounts, longer analytics, spaced repetition scheduling, curriculum recommendations, and more.</p>
      </section>

      <section className="card">
        <h3 className="font-semibold">Advantages</h3>
        <ul className="mt-2 list-disc ml-5 text-sm text-zinc-600">
          <li>Fast quiz generation</li>
          <li>Personalized to topics and difficulty</li>
          <li>Immediate grading and progress tracking</li>
        </ul>
      </section>
    </div>
  );
}
