import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Loader2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("analyst");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.trim()) e.email = "Email is required";
    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Min 8 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      await signup({ name, email, password, role });
      toast.success("Account created!");
      navigate("/dashboard");
    } catch (err: any) {
      toast.error(err.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = (field: string) =>
    `w-full mt-1 bg-secondary border rounded-lg px-4 py-3 text-sm text-foreground focus:outline-none focus:border-primary ${
      errors[field] ? "border-destructive" : "border-border"
    }`;

  return (
    <div className="min-h-screen flex">
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

      <div className="flex-1 flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-8">
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
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} className={fieldClass("name")} placeholder="John Doe" />
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={fieldClass("email")} placeholder="john@company.com" />
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className={fieldClass("password")} placeholder="••••••••" />
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Role</label>
              <select value={role} onChange={(e) => setRole(e.target.value)} className={fieldClass("role")}>
                <option value="analyst">Security Analyst</option>
                <option value="admin">Administrator</option>
                <option value="manager">Team Manager</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-display font-bold text-sm hover:bg-primary/90 transition-all mt-2 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {submitting && <Loader2 size={16} className="animate-spin" />}
              CREATE ACCOUNT
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
