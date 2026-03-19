import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { reportsAPI } from "../services/api";
import { Loader2 } from "lucide-react";

const mockBarData = [
  { type: "Phishing", count: 142 },
  { type: "Malware", count: 85 },
  { type: "Spoofing", count: 63 },
  { type: "Ransomware", count: 28 },
  { type: "BEC", count: 19 },
];

const mockPieData = [
  { name: "Critical", value: 28, color: "hsl(0 91% 71%)" },
  { name: "High", value: 35, color: "hsl(38 95% 59%)" },
  { name: "Medium", value: 22, color: "hsl(188 86% 43%)" },
  { name: "Low", value: 15, color: "hsl(158 64% 52%)" },
];

const mockStats = [
  { label: "Total Scans", value: "12,847", color: "text-primary" },
  { label: "Threats Blocked", value: "337", color: "text-danger" },
  { label: "Emails Flagged", value: "1,204", color: "text-warning" },
  { label: "Avg Response Time", value: "420ms", color: "text-success" },
];

const mockHistory = [
  { date: "2024-03-15", type: "URL Scan", target: "https://phish-site.xyz", result: "Blocked", risk: 92 },
  { date: "2024-03-15", type: "Email", target: "support@paypa1.com", result: "Flagged", risk: 78 },
  { date: "2024-03-14", type: "URL Scan", target: "https://legit-site.com", result: "Safe", risk: 8 },
  { date: "2024-03-14", type: "Email", target: "hr@company.com", result: "Safe", risk: 5 },
  { date: "2024-03-13", type: "URL Scan", target: "https://malware-dl.net", result: "Blocked", risk: 95 },
];

export default function Reports() {
  const [data, setData] = useState<any>(null);
  const [from, setFrom] = useState(7);
  const [type, setType] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await reportsAPI.get(from, type);
        setData(res);
      } catch (err) {
        console.warn("Reports API failed, using mock data", err);
        setData({
          summary: mockStats,
          threatsByType: mockBarData,
          riskDistribution: mockPieData,
          scanHistory: mockHistory
        });
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, [from, type]);

  if (loading && !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[500px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
        <p className="font-mono text-sm text-muted-foreground">Compiling Security Reports...</p>
      </div>
    );
  }

  const dStats = data?.summary || mockStats;
  const dBar = data?.threatsByType || mockBarData;
  const dPie = data?.riskDistribution || mockPieData;
  const dHist = data?.scanHistory || mockHistory;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-display font-extrabold tracking-tighter">Reports</h1>
        <div className="flex gap-3">
          <select 
            value={from} 
            onChange={e => setFrom(Number(e.target.value))}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          >
            <option value={7}>Last 7 Days</option>
            <option value={30}>Last 30 Days</option>
            <option value={90}>Last 90 Days</option>
          </select>
          <select 
            value={type}
            onChange={e => setType(e.target.value)}
            className="bg-secondary border border-border rounded-lg px-3 py-2 text-xs font-mono text-foreground focus:outline-none focus:border-primary"
          >
            <option value="all">All Types</option>
            <option value="url">URL Scans</option>
            <option value="email">Email Analysis</option>
          </select>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {dStats.map((s: any) => (
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
              <BarChart data={dBar} layout="vertical">
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
                <Pie data={dPie} cx="50%" cy="50%" innerRadius={60} outerRadius={100} dataKey="value" stroke="none">
                  {dPie.map((entry: any, i: number) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(222 47% 10%)", border: "1px solid hsl(222 47% 20%)", borderRadius: "8px", fontSize: "12px" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {dPie.map((d: any) => (
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
              {dHist.map((h: any, i: number) => (
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
