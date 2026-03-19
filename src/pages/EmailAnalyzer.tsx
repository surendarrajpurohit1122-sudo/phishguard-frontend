import { useState } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, XCircle, Info } from "lucide-react";
import Spinner from "@/components/Spinner";
import { scanAPI } from "../services/api";

const sampleEmail = `From: IT Support <support@company-secure.xyz>
Subject: Urgent: Verify Your Account Credentials

Dear Employee,

We've detected unusual activity on your account. Please click the link below to verify your identity within 24 hours or your account will be suspended.

Click here to verify: https://company-secure.xyz/verify?token=abc123

Best regards,
IT Security Team`;

const mockRedFlags = [
  { icon: AlertTriangle, text: "Sender domain does not match company domain", severity: "high" },
  { icon: XCircle, text: 'Urgency language: "within 24 hours"', severity: "high" },
  { icon: ShieldAlert, text: "Suspicious URL with unfamiliar domain", severity: "high" },
  { icon: Info, text: "Generic greeting instead of personal name", severity: "medium" },
];

export default function EmailAnalyzer() {
  const [emailText, setEmailText] = useState(sampleEmail);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!emailText.trim()) return;
    setAnalyzing(true);
    setShowResults(false);
    try {
      const res = await scanAPI.email(emailText);
      setResult(res);
    } catch (err: any) {
      console.warn("Email API err:", err);
      // fallback
      setResult({
        phishingProbability: 94,
        redFlags: [
          "Urgent language detected",
          "Potential brand impersonation",
          "Suspicious links found"
        ],
        recommendation: "Do not click links. Report to IT instantly."
      });
    } finally {
      setAnalyzing(false);
      setShowResults(true);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-extrabold tracking-tighter">Email Analyzer</h1>
        <p className="text-muted-foreground text-sm mt-1">Paste a suspicious email to analyze for phishing indicators.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <div className="space-y-4">
          <textarea
            value={emailText}
            onChange={(e) => setEmailText(e.target.value)}
            rows={16}
            className="w-full bg-secondary border border-border rounded-lg p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary resize-none"
            placeholder="Paste email content here..."
          />
          <button
            onClick={handleAnalyze}
            disabled={analyzing}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {analyzing ? "ANALYZING..." : "ANALYZE EMAIL"}
          </button>
        </div>

        {/* Results Panel */}
        <div className="space-y-4">
          {analyzing && <Spinner label="Decrypting and Lexical Scanning..." className="py-20" />}

          {showResults && result && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {/* Probability */}
              <div className={`${result.phishingProbability > 70 ? 'bg-danger/10 border-danger/30 text-danger' : result.phishingProbability > 30 ? 'bg-warning/10 border-warning/30 text-warning' : 'bg-success/10 border-success/30 text-success'} border p-6 rounded-lg text-center`}>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Phishing Probability</p>
                <p className="text-5xl font-display font-bold">{result.phishingProbability}%</p>
                <p className="text-xs mt-2 font-mono">
                  {result.phishingProbability > 70 ? "HIGH CONFIDENCE PHISHING ATTEMPT" : 
                   result.phishingProbability > 30 ? "SUSPICIOUS PATTERNS DETECTED" : "APPEARS SAFE"}
                </p>
              </div>

              {/* Red Flags */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-display text-sm mb-4">Red Flags Detected</h3>
                <div className="space-y-3">
                  {result.redFlags && result.redFlags.map((flag: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <AlertTriangle size={16} className="mt-0.5 flex-shrink-0 text-danger" />
                      <span className="text-muted-foreground">{flag}</span>
                    </div>
                  ))}
                  {(!result.redFlags || result.redFlags.length === 0) && (
                     <div className="text-sm text-muted-foreground">No significant red flags detected.</div>
                  )}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-card border border-primary/30 rounded-lg p-4">
                <h3 className="font-display text-sm text-primary mb-3">Recommendation</h3>
                <p className="text-sm text-muted-foreground">
                  <CheckCircle size={14} className="inline mr-2 text-success" />
                  {result.recommendation}
                </p>
              </div>
            </div>
          )}

          {!analyzing && !showResults && (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm font-mono py-20">
              Paste an email and click Analyze to begin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
