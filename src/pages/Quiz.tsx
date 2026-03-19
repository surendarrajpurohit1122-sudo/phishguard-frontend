import { useState } from "react";
import { BookOpen, CheckCircle, XCircle } from "lucide-react";

const modules = [
  { title: "Phishing Fundamentals", desc: "Learn to identify common phishing attacks", progress: 100, questions: 12 },
  { title: "Social Engineering", desc: "Understanding manipulation tactics", progress: 60, questions: 15 },
  { title: "Advanced Threat Detection", desc: "Detect sophisticated attack patterns", progress: 0, questions: 10 },
];

const questions = [
  {
    q: 'You receive an email from "IT Support" asking you to click a link to validate your SSO credentials. What should you check first?',
    options: [
      "The sender's actual email address domain",
      "The urgency of the language used",
      "If the link uses HTTPS",
      "All of the above",
    ],
    correct: 0,
  },
  {
    q: "Which of the following is a strong indicator of a phishing URL?",
    options: [
      "The URL uses HTTPS",
      "The domain contains misspelled brand names",
      "The website loads quickly",
      "The page has a modern design",
    ],
    correct: 1,
  },
  {
    q: "What is 'spear phishing'?",
    options: [
      "Sending malware via USB drives",
      "Mass email campaigns to random users",
      "Targeted attacks using personal information",
      "Phishing through phone calls",
    ],
    correct: 2,
  },
];

const leaderboard = [
  { name: "Sarah Chen", dept: "Engineering", score: 980 },
  { name: "Marcus Wright", dept: "Sales", score: 945 },
  { name: "Elena Rodriguez", dept: "HR", score: 910 },
  { name: "James Kim", dept: "Finance", score: 875 },
  { name: "Priya Patel", dept: "Marketing", score: 840 },
];

export default function Quiz() {
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    if (idx === questions[currentQ].correct) setScore((s) => s + 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      setFinished(true);
    }
  };

  const resetQuiz = () => {
    setActiveQuiz(false);
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setFinished(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {!activeQuiz ? (
          <>
            <h1 className="text-3xl font-display font-extrabold tracking-tighter">Security Awareness Training</h1>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {modules.map((m, i) => (
                <div key={i} className="bg-card border border-border p-5 rounded-lg space-y-3 hover:border-primary/50 transition-all">
                  <BookOpen size={20} className="text-primary" />
                  <h3 className="font-bold text-sm">{m.title}</h3>
                  <p className="text-[10px] text-muted-foreground">{m.desc}</p>
                  <div className="w-full bg-secondary rounded-full h-1.5">
                    <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${m.progress}%` }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground">
                    <span>{m.questions} questions</span>
                    <span>{m.progress}%</span>
                  </div>
                  <button
                    onClick={() => setActiveQuiz(true)}
                    className={`w-full py-2 rounded-lg text-xs font-display font-bold transition-all ${
                      m.progress === 100
                        ? "bg-success/10 text-success border border-success/20"
                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                    }`}
                  >
                    {m.progress === 100 ? "COMPLETED" : m.progress > 0 ? "CONTINUE" : "START"}
                  </button>
                </div>
              ))}
            </div>
          </>
        ) : finished ? (
          <div className="bg-card border border-border p-8 rounded-lg text-center space-y-6">
            <h2 className="text-2xl font-display font-bold">Quiz Complete</h2>
            <div className="text-6xl font-display font-bold text-primary">
              {Math.round((score / questions.length) * 100)}%
            </div>
            <p className="text-muted-foreground">
              You got {score} out of {questions.length} correct
            </p>
            <button onClick={resetQuiz} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:bg-primary/90 transition-all">
              BACK TO MODULES
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border p-8 rounded-lg relative overflow-hidden">
            <div className="absolute top-0 left-0 h-1 bg-primary transition-all" style={{ width: `${((currentQ + 1) / questions.length) * 100}%` }} />
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Question {currentQ + 1} of {questions.length}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded">LEVEL: INTERMEDIATE</span>
            </div>

            <h2 className="text-lg font-bold mb-8 leading-relaxed">{questions[currentQ].q}</h2>

            <div className="space-y-3">
              {questions[currentQ].options.map((opt, i) => {
                let borderClass = "border-border hover:border-primary hover:bg-primary/5";
                if (answered) {
                  if (i === questions[currentQ].correct) borderClass = "border-success bg-success/10";
                  else if (i === selected) borderClass = "border-danger bg-danger/10";
                  else borderClass = "border-border opacity-50";
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(i)}
                    className={`w-full text-left p-4 border rounded-lg transition-all text-sm flex items-center justify-between ${borderClass}`}
                  >
                    {opt}
                    {answered && i === questions[currentQ].correct && <CheckCircle size={16} className="text-success" />}
                    {answered && i === selected && i !== questions[currentQ].correct && <XCircle size={16} className="text-danger" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <button
                onClick={handleNext}
                className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:bg-primary/90 transition-all"
              >
                {currentQ < questions.length - 1 ? "NEXT QUESTION" : "VIEW RESULTS"}
              </button>
            )}

            {/* Progress dots */}
            <div className="flex gap-2 mt-6 justify-center">
              {questions.map((_, i) => (
                <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQ ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="space-y-6">
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-display text-sm mb-4">Department Leaderboard</h3>
          <div className="space-y-4">
            {leaderboard.map((user, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.dept}</p>
                </div>
                <span className="font-mono text-xs text-primary font-bold">{user.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
