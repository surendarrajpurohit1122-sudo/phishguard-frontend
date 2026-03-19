import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Globe, Mail, GraduationCap, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";

const chartData = [
  { name: "Mon", scans: 45, threats: 12 },
  { name: "Tue", scans: 52, threats: 8 },
  { name: "Wed", scans: 38, threats: 15 },
  { name: "Thu", scans: 65, threats: 22 },
  { name: "Fri", scans: 48, threats: 10 },
  { name: "Sat", scans: 24, threats: 4 },
  { name: "Sun", scans: 30, threats: 7 },
];

const stats = [
  { label: "Total Scans Today", value: "1,284", color: "text-primary", sub: "+12% from yesterday" },
  { label: "Threats Detected", value: "42", color: "text-danger", sub: "Critical severity" },
  { label: "Emails Analyzed", value: "856", color: "text-warning", sub: "24 flagged for review" },
  { label: "Avg Quiz Score", value: "92%", color: "text-success", sub: "Top 10% of industry" },
];

const threats = [
  { type: "Phishing", source: "https://secure-login-bank.xyz/auth", severity: "Critical", time: "2 min ago", status: "Blocked" },
  { type: "Malware", source: "https://free-download.malware.net/setup", severity: "High", time: "15 min ago", status: "Blocked" },
  { type: "Spoofing", source: "support@paypa1-security.com", severity: "Medium", time: "1 hr ago", status: "Flagged" },
  { type: "Phishing", source: "https://amaz0n-verify.co/login", severity: "Critical", time: "2 hr ago", status: "Blocked" },
];

const severityColor: Record<string, string> = {
  Critical: "bg-danger",
  High: "bg-warning",
  Medium: "bg-primary",
};

const quickActions = [
  { label: "Scan URL", icon: Globe, href: "/scanner" },
  { label: "Analyze Email", icon: Mail, href: "/email" },
  { label: "Take Quiz", icon: GraduationCap, href: "/quiz" },
  { label: "Reports", icon: BarChart3, href: "/reports" },
];

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border p-5 rounded-lg hover:border-primary/50 transition-all">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">{s.label}</p>
            <h3 className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</h3>
            <p className="text-[10px] text-muted-foreground mt-2 font-mono">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Chart + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border p-6 rounded-lg">
          <h3 className="font-display mb-6 text-sm">Threat Activity (7 Days)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 20%)" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(215 20% 55%)" fontSize={12} />
                <YAxis stroke="hsl(215 20% 55%)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(222 47% 10%)",
                    border: "1px solid hsl(222 47% 20%)",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="scans" fill="hsl(188 86% 43%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="threats" fill="hsl(0 91% 71%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-3">
          {quickActions.map((a) => (
            <Link
              key={a.label}
              to={a.href}
              className={`w-full py-4 rounded-lg font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                a.label === "Scan URL"
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "border border-border bg-foreground/5 text-foreground hover:bg-foreground/10"
              }`}
            >
              <a.icon size={18} />
              {a.label.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Threats */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex justify-between items-center">
          <h3 className="font-display text-sm">Live Threat Feed</h3>
          <span className="text-[10px] font-mono text-muted-foreground uppercase">Real-time updates</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Source</th>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Detected At</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {threats.map((t, i) => (
                <tr key={i} className="border-b border-border hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-danger/10 text-danger text-[10px] font-bold rounded border border-danger/20 uppercase">
                      {t.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{t.source}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${severityColor[t.severity] || "bg-muted-foreground"}`} />
                      <span className="text-xs">{t.severity}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground font-mono">{t.time}</td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-muted-foreground italic">{t.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
