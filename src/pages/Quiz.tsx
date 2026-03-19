import { useState, useEffect } from "react";
import { BookOpen, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { quizAPI } from "../services/api";

const modules = [
  { title: "Phishing Fundamentals", desc: "Learn to identify common phishing attacks", progress: 100, questions: 12 },
  { title: "Social Engineering", desc: "Understanding manipulation tactics", progress: 60, questions: 15 },
  { title: "Advanced Threat Detection", desc: "Detect sophisticated attack patterns", progress: 0, questions: 10 },
];

const mockQuestions = [
  {
    question: 'You receive an email from "IT Support" asking you to click a link to validate your SSO credentials. What should you check first?',
    options: [
      "The sender's actual email address domain",
      "The urgency of the language used",
      "If the link uses HTTPS",
      "All of the above",
    ],
    correctIndex: 0,
  },
  {
    question: "Which of the following is a strong indicator of a phishing URL?",
    options: [
      "The URL uses HTTPS",
      "The domain contains misspelled brand names",
      "The website loads quickly",
      "The page has a modern design",
    ],
    correctIndex: 1,
  },
  {
    question: "What is 'spear phishing'?",
    options: [
      "Sending malware via USB drives",
      "Mass email campaigns to random users",
      "Targeted attacks using personal information",
      "Phishing through phone calls",
    ],
    correctIndex: 2,
  },
];

const mockLeaderboard = [
  { name: "Sarah Chen", department: "Engineering", percentage: 98 },
  { name: "Marcus Wright", department: "Sales", percentage: 94 },
  { name: "Elena Rodriguez", department: "HR", percentage: 91 },
  { name: "James Kim", department: "Finance", percentage: 87 },
  { name: "Priya Patel", department: "Marketing", percentage: 84 },
];

export default function Quiz() {
  const [activeQuiz, setActiveQuiz] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const [dbQuestions, setDbQuestions] = useState<any[]>(mockQuestions);
  const [dbLeaderboard, setDbLeaderboard] = useState<any[]>(mockLeaderboard);
  const [loading, setLoading] = useState(true);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    const fetchInit = async () => {
      try {
        const [qRes, lRes] = await Promise.all([
          quizAPI.questions(),
          quizAPI.leaderboard().catch(() => null)
        ]);
        if (qRes && qRes.length > 0) setDbQuestions(qRes);
        if (lRes && lRes.length > 0) setDbLeaderboard(lRes);
      } catch (err) {
        console.warn("Quiz API err:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInit();
  }, []);

  const handleSelect = (idx: number) => {
    if (answered) return;
    setSelected(idx);
    setAnswered(true);
    
    setUserAnswers((prev) => {
      const newAns = [...prev];
      newAns[currentQ] = idx;
      return newAns;
    });

    const isCorrect = dbQuestions[currentQ].correctIndex === idx || dbQuestions[currentQ].correct === idx;
    if (isCorrect) {
      setScore((s) => s + 1);
    }
  };

  const handleNext = async () => {
    if (currentQ < dbQuestions.length - 1) {
      setCurrentQ((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    } else {
      try {
        const result = await quizAPI.submit(userAnswers);
        setQuizResult(result);
        const lRes = await quizAPI.leaderboard();
        if (lRes) setDbLeaderboard(lRes);
      } catch (err) {
        console.warn(err);
        setQuizResult({ score, total: dbQuestions.length, percentage: Math.round((score/dbQuestions.length)*100), badge: "Security Aware" });
      }
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
    setUserAnswers([]);
    setQuizResult(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        {loading ? (
           <div className="flex flex-col items-center justify-center min-h-[400px]">
             <Loader2 className="animate-spin text-primary w-8 h-8 mb-4" />
             <p className="text-sm font-mono text-muted-foreground">Loading Quiz Modules...</p>
           </div>
        ) : !activeQuiz ? (
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
          <div className="bg-card border border-border p-8 rounded-lg text-center space-y-6 animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-display font-bold">{quizResult?.badge || "Quiz Complete"}</h2>
            <div className="text-6xl font-display font-bold text-primary">
              {quizResult?.percentage || Math.round((score / dbQuestions.length) * 100)}%
            </div>
            <p className="text-muted-foreground">
              You got {quizResult?.score || score} out of {quizResult?.total || dbQuestions.length} correct
            </p>
            <button onClick={resetQuiz} className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:bg-primary/90 transition-all">
              BACK TO MODULES
            </button>
          </div>
        ) : (
          <div className="bg-card border border-border p-8 rounded-lg relative overflow-hidden animate-in slide-in-from-right-4 duration-300">
            <div className="absolute top-0 left-0 h-1 bg-primary transition-all" style={{ width: `${((currentQ + 1) / dbQuestions.length) * 100}%` }} />
            <div className="flex justify-between items-center mb-8">
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-widest">
                Question {currentQ + 1} of {dbQuestions.length}
              </span>
              <span className="px-2 py-1 bg-primary/10 text-primary text-[10px] font-bold rounded">LEVEL: INTERMEDIATE</span>
            </div>

            <h2 className="text-lg font-bold mb-8 leading-relaxed">{dbQuestions[currentQ].question || dbQuestions[currentQ].q}</h2>

            <div className="space-y-3">
              {dbQuestions[currentQ].options.map((opt: string, i: number) => {
                let borderClass = "border-border hover:border-primary hover:bg-primary/5";
                const isCorrectIndex = dbQuestions[currentQ].correctIndex ?? dbQuestions[currentQ].correct;
                if (answered) {
                  if (i === isCorrectIndex) borderClass = "border-success bg-success/10";
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
                    {answered && i === isCorrectIndex && <CheckCircle size={16} className="text-success" />}
                    {answered && i === selected && i !== isCorrectIndex && <XCircle size={16} className="text-danger" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <button
                onClick={handleNext}
                className="mt-6 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold hover:bg-primary/90 transition-all"
              >
                {currentQ < dbQuestions.length - 1 ? "NEXT QUESTION" : "VIEW RESULTS"}
              </button>
            )}

            {/* Progress dots */}
            <div className="flex gap-2 mt-6 justify-center">
              {dbQuestions.map((_, i) => (
                 <div key={i} className={`w-2 h-2 rounded-full ${i <= currentQ ? "bg-primary" : "bg-border"}`} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div className="space-y-6">
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-display text-sm mb-4">Top Defenders</h3>
          <div className="space-y-4">
            {dbLeaderboard.map((user, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-lg">{i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}</span>
                <div className="flex-1">
                  <p className="text-xs font-bold">{user.name}</p>
                  <p className="text-[10px] text-muted-foreground">{user.department || user.dept || "Security"}</p>
                </div>
                <span className="font-mono text-xs text-primary font-bold">{user.percentage || user.score}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
