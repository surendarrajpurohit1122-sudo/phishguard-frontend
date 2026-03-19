import { useState } from "react";
import { AlertTriangle, CheckCircle, ShieldAlert, XCircle, Info } from "lucide-react";
import Spinner from "@/components/Spinner";

const sampleEmail = `From: IT Support <support@company-secure.xyz>
Subject: Urgent: Verify Your Account Credentials

Dear Employee,

We've detected unusual activity on your account. Please click the link below to verify your identity within 24 hours or your account will be suspended.

Click here to verify: https://company-secure.xyz/verify?token=abc123

Best regards,
IT Security Team`;

const redFlags = [
  { icon: AlertTriangle, text: "Sender domain does not match company domain", severity: "high" },
  { icon: XCircle, text: 'Urgency language: "within 24 hours"', severity: "high" },
  { icon: ShieldAlert, text: "Suspicious URL with unfamiliar domain", severity: "high" },
  { icon: Info, text: "Generic greeting instead of personal name", severity: "medium" },
  { icon: Info, text: "Threat of account suspension", severity: "medium" },
];

export default function EmailAnalyzer() {
  const [emailText, setEmailText] = useState(sampleEmail);
  const [analyzing, setAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleAnalyze = () => {
    if (!emailText.trim()) return;
    setAnalyzing(true);
    setShowResults(false);
    setTimeout(() => {
      setAnalyzing(false);
      setShowResults(true);
    }, 1800);
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
          {analyzing && <Spinner label="Decrypting Payload..." className="py-20" />}

          {showResults && (
            <div className="space-y-4 animate-in fade-in duration-500">
              {/* Probability */}
              <div className="bg-danger/10 border border-danger/30 p-6 rounded-lg text-center">
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-2">Phishing Probability</p>
                <p className="text-5xl font-display font-bold text-danger">94%</p>
                <p className="text-xs text-danger/80 mt-2 font-mono">HIGH CONFIDENCE PHISHING ATTEMPT</p>
              </div>

              {/* Red Flags */}
              <div className="bg-card border border-border rounded-lg p-4">
                <h3 className="font-display text-sm mb-4">Red Flags Detected</h3>
                <div className="space-y-3">
                  {redFlags.map((flag, i) => (
                    <div key={i} className="flex items-start gap-3 text-sm">
                      <flag.icon
                        size={16}
                        className={`mt-0.5 flex-shrink-0 ${
                          flag.severity === "high" ? "text-danger" : "text-warning"
                        }`}
                      />
                      <span className="text-muted-foreground">{flag.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendation */}
              <div className="bg-card border border-primary/30 rounded-lg p-4">
                <h3 className="font-display text-sm text-primary mb-3">Recommendation</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success" /> Do not click any links in this email
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success" /> Report to your IT security team
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-success" /> Mark as spam and delete
                  </li>
                </ul>
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
