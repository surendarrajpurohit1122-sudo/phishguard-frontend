import { useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function SettingsPage() {
  const [backendUrl, setBackendUrl] = useState("https://api.phishguard.io");
  const [connectionStatus, setConnectionStatus] = useState<"idle" | "testing" | "connected" | "failed">("idle");
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@company.com");
  const [department, setDepartment] = useState("Engineering");
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [criticalAlerts, setCriticalAlerts] = useState(true);

  const testConnection = () => {
    setConnectionStatus("testing");
    setTimeout(() => setConnectionStatus("connected"), 1500);
  };

  const Toggle = ({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!checked)}
      className={`w-10 h-5 rounded-lg transition-all relative ${checked ? "bg-primary" : "bg-border"}`}
    >
      <div className={`absolute top-0.5 w-4 h-4 rounded bg-foreground transition-all ${checked ? "left-5.5" : "left-0.5"}`} />
    </button>
  );

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-3xl font-display font-extrabold tracking-tighter">Settings</h1>

      {/* Backend Connection */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-display text-sm">Backend Connection</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={backendUrl}
            onChange={(e) => setBackendUrl(e.target.value)}
            className="flex-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm font-mono text-foreground focus:outline-none focus:border-primary"
          />
          <button
            onClick={testConnection}
            disabled={connectionStatus === "testing"}
            className="px-6 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50"
          >
            {connectionStatus === "testing" ? <Loader2 size={16} className="animate-spin" /> : "TEST"}
          </button>
        </div>
        {connectionStatus === "connected" && (
          <div className="flex items-center gap-2 text-success text-xs">
            <CheckCircle size={14} /> Connected successfully
          </div>
        )}
        {connectionStatus === "failed" && (
          <div className="flex items-center gap-2 text-danger text-xs">
            <XCircle size={14} /> Connection failed
          </div>
        )}
      </div>

      {/* Profile */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-display text-sm">Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Department</label>
            <input
              type="text"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full mt-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <button className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-all">
          SAVE CHANGES
        </button>
      </div>

      {/* Notifications */}
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="font-display text-sm">Notifications</h3>
        <div className="space-y-4">
          {[
            { label: "Email Notifications", desc: "Receive scan results via email", checked: emailNotifs, onChange: setEmailNotifs },
            { label: "Slack Alerts", desc: "Push alerts to Slack channel", checked: slackNotifs, onChange: setSlackNotifs },
            { label: "Critical Alerts Only", desc: "Only notify on high-severity threats", checked: criticalAlerts, onChange: setCriticalAlerts },
          ].map((n) => (
            <div key={n.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{n.label}</p>
                <p className="text-[10px] text-muted-foreground">{n.desc}</p>
              </div>
              <Toggle checked={n.checked} onChange={n.onChange} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
