import { useState } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex">
      {/* Left branding */}
      <div className="hidden lg:flex w-1/2 bg-card border-r border-border flex-col items-center justify-center p-12 space-y-6">
        <ShieldCheck size={64} className="text-primary" />
        <h1 className="text-4xl font-display font-extrabold tracking-tighter">PHISHGUARD</h1>
        <p className="text-muted-foreground text-center max-w-sm">
          Advanced phishing detection and security awareness platform. Protect your organization from evolving cyber threats.
        </p>
        <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-success/10 border border-success/20">
          <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
          <span className="text-[10px] font-mono text-success uppercase tracking-widest">All Systems Operational</span>
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
            <h2 className="text-2xl font-display font-bold tracking-tighter">Welcome Back</h2>
            <p className="text-muted-foreground text-sm mt-1">Sign in to your account</p>
          </div>

          <div className="space-y-4">
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
            <Link to="/dashboard">
              <button className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-all mt-2">
                SIGN IN
              </button>
            </Link>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
