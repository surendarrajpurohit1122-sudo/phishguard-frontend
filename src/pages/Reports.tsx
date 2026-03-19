import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";

const barData = [
  { type: "Phishing", count: 142 },
  { type: "Malware", count: 85 },
  { type: "Spoofing", count: 63 },
  { type: "Ransomware", count: 28 },
  { type: "BEC", count: 19 },
];

const pieData = [
  { name: "Critical", value: 28, color: "hsl(0 91% 71%)" },
  { name: "High", value: 35, color: "hsl(38 95% 59%)" },
  { name: "Medium", value: 22, color: "hsl(188 86% 43%)" },
  { name: "Low", value: 15, color: "hsl(158 64% 52%)" },
];

const stats = [
  { label: "Total Scans", value: "12,847", color: "text-primary" },
  { label: "Threats Blocked", value: "337", color: "text-danger" },
  { label: "Emails Flagged", value: "1,204", color: "text-warning" },
  { label: "Avg Response Time", value: "420ms", color: "text-success" },
];

const history = [
  { date: "2024-03-15", type: "URL Scan", target: "https://phish-site.xyz", result: "Blocked", risk: 92 },
  { date: "2024-03-15", type: "Email", target: "support@paypa1.com", result: "Flagged", risk: 78 },
  { date: "2024-03-14", type: "URL Scan", target: "https://legit-site.com", result: "Safe", risk: 8 },
  { date: "2024-03-14", type: "Email", target: "hr@company.com", result: "Safe", risk: 5 },
  { date: "2024-03-13", type: "URL Scan", target: "https://malware-dl.net", result: "Blocked", risk: 95 },
];

export default function Reports() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-extrabold tracking-tighter">Reports</h1>
        <div className="flex gap-3">
          <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>Last 90 Days</option>
          </select>
          <select className="bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary">
            <option>All Types</option>
            <option>URL Scans</option>
            <option>Email Analysis</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-card border border-border p-5 rounded-lg">
            <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mb-1">{s.label}</p>
            <h3 className={`text-3xl font-display font-bold ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-display text-sm mb-6">Threats by Type</h3>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222 47% 20%)" horizontal={false} />
                <XAxis type="number" stroke="hsl(215 20% 55%)" fontSize={12} />
                <YAxis dataKey="type" type="category" stroke="hsl(215 20% 55%)" fontSize={12} width={90} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 10%)", border: "1px solid hsl(222 47% 20%)", borderRadius: "8px", fontSize: "12px" }} />
                <Bar dataKey="count" fill="hsl(188 86% 43%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-border p-6 rounded-lg">
          <h3 className="font-display text-sm mb-6">Risk Distribution</h3>
          <div className="h-[280px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 10%)", border: "1px solid hsl(222 47% 20%)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {pieData.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border">
          <h3 className="font-display text-sm">Scan History</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-foreground/5 text-[10px] uppercase tracking-widest text-muted-foreground">
                <th className="px-6 py-3 font-medium">Date</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Target</th>
                <th className="px-6 py-3 font-medium">Risk</th>
                <th className="px-6 py-3 font-medium">Result</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {history.map((h, i) => (
                <tr key={i} className="border-b border-border hover:bg-foreground/5 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{h.date}</td>
                  <td className="px-6 py-4 text-xs">{h.type}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground">{h.target}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${h.risk > 70 ? "text-danger" : h.risk > 30 ? "text-warning" : "text-success"}`}>
                      {h.risk}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground">{h.result}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
