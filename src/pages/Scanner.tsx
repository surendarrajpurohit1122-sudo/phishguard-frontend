import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Globe } from "lucide-react";
import Spinner from "@/components/Spinner";
import { scanAPI } from "../services/api";
import { toast } from "sonner"; // If you have sonner, else fallback

const exampleUrls = [
  "https://secure-login-bank.xyz/verify",
  "https://google.com",
  "https://amaz0n-deals.co/login",
];

const mockResult = {
  riskScore: 82,
  verdict: "DANGEROUS",
  threats: [
    { threatType: "Domain Age", severity: "WARN", description: "Registered within 14 days" },
    { threatType: "Suspicious Keywords", severity: "FAIL", description: "Found 'login', 'verify'" },
    { threatType: "Blacklist Hit", severity: "FAIL", description: "Google Safe Browsing Match" },
  ]
};

const statusColor: Record<string, string> = { PASS: "text-success", FAIL: "text-danger", WARN: "text-warning" };

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!url) return;
    setScanning(true);
    setShowResults(false);
    
    try {
      const res = await scanAPI.url(url);
      setResult(res);
    } catch (err: any) {
      console.warn("API scan failed. Using mock result.", err);
      try { toast.error("Live scan failed. Loading offline result."); } catch {}
      setResult(mockResult);
    } finally {
      setScanning(false);
      setShowResults(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-display font-extrabold tracking-tighter">Deep Scan Engine</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Input a suspicious URL to perform a multi-vector analysis across domain age, SSL validity, and global blacklists.
        </p>
      </div>

      {/* Input */}
      <div className="relative group">
        <div className="absolute -inset-1 bg-primary/20 rounded-lg blur opacity-25 group-focus-within:opacity-100 transition duration-1000" />
        <div className="relative flex gap-2">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleScan()}
            placeholder="https://suspicious-link.com/verify-account"
            className="flex-1 bg-secondary border border-border px-6 py-4 rounded-lg focus:outline-none focus:border-primary font-mono text-sm text-foreground placeholder:text-muted-foreground"
          />
          <button
            onClick={handleScan}
            disabled={scanning}
            className="bg-primary text-primary-foreground px-8 rounded-lg font-display font-bold hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {scanning ? "SCANNING..." : "SCAN NOW"}
          </button>
        </div>
      </div>

      {/* Example chips */}
      <div className="flex flex-wrap gap-2 justify-center">
        {exampleUrls.map((u) => (
          <button
            key={u}
            onClick={() => setUrl(u)}
            className="px-3 py-1 text-xs font-mono border border-border rounded-lg text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
          >
            {u}
          </button>
        ))}
      </div>

      {scanning && <Spinner label="Target acquired. Querying Engine..." className="py-12" />}

      {/* Results */}
      {showResults && result && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 animate-in fade-in duration-500">
          {/* Risk Gauge */}
          <div className="bg-card border border-border p-8 rounded-lg flex flex-col items-center justify-center text-center">
            <div className="relative w-32 h-32 flex items-center justify-center mb-4">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
                <circle cx="64" cy="64" r="58" stroke="hsl(222 47% 20%)" strokeWidth="8" fill="transparent" />
                <circle
                  cx="64"
                  cy="64"
                  r="58"
                  stroke={result.riskScore < 30 ? "hsl(142 71% 45%)" : result.riskScore < 70 ? "hsl(48 96% 53%)" : "hsl(0 91% 71%)"}
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="364.4"
                  strokeDashoffset={364.4 - (364.4 * result.riskScore) / 100}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-3xl font-display font-bold">{result.riskScore}</span>
            </div>
            <p className="font-display text-xs tracking-widest text-muted-foreground">RISK SCORE</p>
          </div>

          {/* Verdict + Breakdown */}
          <div className="md:col-span-2 space-y-4">
            <div className={`border p-4 rounded-lg flex items-center justify-between ${
               result.verdict.toUpperCase() === 'SAFE' ? 'bg-success/10 border-success/30' :
               result.verdict.toUpperCase() === 'DANGEROUS' ? 'bg-danger/10 border-danger/30' :
               'bg-warning/10 border-warning/30'
            }`}>
              <span className={`font-display font-bold tracking-widest ${
                result.verdict.toUpperCase() === 'SAFE' ? 'text-success' :
                result.verdict.toUpperCase() === 'DANGEROUS' ? 'text-danger' :
                'text-warning'
              }`}>VERDICT: {result.verdict.toUpperCase()}</span>
              {result.verdict.toUpperCase() === 'SAFE' ? <ShieldCheck className="text-success" /> : <ShieldX className="text-danger" />}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {result.threats && result.threats.map((item: any, idx: number) => (
                <div key={idx} className="bg-secondary border border-border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.threatType}</p>
                    <p className="text-xs font-bold">{item.description}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${statusColor[item.severity] || "text-foreground"}`}>
                    {item.severity}
                  </span>
                </div>
              ))}
            </div>

            {/* If we have details JSON */}
            {result.details && result.details.redirects && (
              <div className="bg-secondary border border-border p-4 rounded-lg mt-4">
                <p className="text-[10px] text-muted-foreground uppercase mb-2">Redirect Chain</p>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap">
                  {result.details.redirects.map((hop: string, i: number) => (
                    <span key={i} className="flex gap-2 items-center">
                       {i > 0 && <span className="text-primary">→</span>}
                       <span className={i === result.details.redirects.length - 1 ? "text-danger" : "text-foreground"}>{hop}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
