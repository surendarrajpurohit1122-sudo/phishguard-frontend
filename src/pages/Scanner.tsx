import { useState } from "react";
import { ShieldCheck, ShieldAlert, ShieldX, Globe } from "lucide-react";
import Spinner from "@/components/Spinner";

const exampleUrls = [
  "https://secure-login-bank.xyz/verify",
  "https://google.com",
  "https://amaz0n-deals.co/login",
];

const breakdownItems = [
  { label: "Domain Age", value: "14 Days", status: "FAIL" as const },
  { label: "SSL Certificate", value: "Valid (Let's Encrypt)", status: "PASS" as const },
  { label: "Blacklist Hit", value: "Google Safe Browsing", status: "FAIL" as const },
  { label: "Suspicious Keywords", value: '"verify", "urgent"', status: "WARN" as const },
  { label: "Redirects", value: "3 Hops Detected", status: "WARN" as const },
];

const statusColor = { PASS: "text-success", FAIL: "text-danger", WARN: "text-warning" };

export default function URLScanner() {
  const [url, setUrl] = useState("");
  const [scanning, setScanning] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleScan = () => {
    if (!url) return;
    setScanning(true);
    setShowResults(false);
    setTimeout(() => {
      setScanning(false);
      setShowResults(true);
    }, 2000);
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

      {scanning && <Spinner label="Querying Blacklists..." className="py-12" />}

      {/* Results */}
      {showResults && (
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
                  stroke="hsl(0 91% 71%)"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="364.4"
                  strokeDashoffset="65"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-3xl font-display font-bold">82</span>
            </div>
            <p className="font-display text-xs tracking-widest text-muted-foreground">RISK SCORE</p>
          </div>

          {/* Verdict + Breakdown */}
          <div className="md:col-span-2 space-y-4">
            <div className="bg-danger/10 border border-danger/30 p-4 rounded-lg flex items-center justify-between">
              <span className="font-display text-danger font-bold tracking-widest">VERDICT: DANGEROUS</span>
              <ShieldX className="text-danger" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {breakdownItems.map((item, idx) => (
                <div key={idx} className="bg-secondary border border-border p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase">{item.label}</p>
                    <p className="text-xs font-bold">{item.value}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${statusColor[item.status]}`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>

            {/* Redirect chain */}
            <div className="bg-secondary border border-border p-4 rounded-lg">
              <p className="text-[10px] text-muted-foreground uppercase mb-2">Redirect Chain</p>
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground flex-wrap">
                <span className="text-foreground">suspicious-link.com</span>
                <span className="text-primary">→</span>
                <span className="text-foreground">redirect1.xyz</span>
                <span className="text-primary">→</span>
                <span className="text-foreground">redirect2.net</span>
                <span className="text-primary">→</span>
                <span className="text-danger">credential-harvest.ru</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
