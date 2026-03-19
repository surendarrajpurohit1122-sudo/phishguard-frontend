import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("analyst");

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex w-1/2 bg-card border-r border-border flex-col items-center justify-center p-12 space-y-6">
        <ShieldCheck size={64} className="text-primary" />
        <h1 className="text-4xl font-display font-extrabold tracking-tighter">PHISHGUARD</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Join thousands of security professionals using PhishGuard to defend against phishing attacks.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-8">
          {[
            { val: "12K+", label: "URLs Scanned" },
            { val: "98%", label: "Detection Rate" },
            { val: "500+", label: "Organizations" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-xl font-display font-bold text-primary">{s.val}</p>
              <p className="text-[10px] text-muted-foreground uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-sm space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <ShieldCheck size={28} className="text-primary" />
            <span className="font-display font-extrabold text-xl tracking-tighter">PHISHGUARD</span>
          </div>
          <div>
            <h2 className="text-2xl font-display font-bold tracking-tighter">Create Account</h2>
            <p className="text-muted-foreground text-sm mt-1">Get started with PhishGuard</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                placeholder="john@company.com"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
                placeholder="••••••••"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full mt-1 bg-secondary border border-border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary"
              >
                <option value="analyst">Security Analyst</option>
                <option value="admin">Administrator</option>
                <option value="manager">Team Manager</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <Link to="/dashboard">
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-all mt-2">
                CREATE ACCOUNT
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
