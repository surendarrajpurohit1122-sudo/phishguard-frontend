import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { authAPI } from "../services/api";

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: { name: string; email: string; password: string; role: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const DEMO_USERS: Record<string, { password: string; name: string; role: string }> = {
  "demo@phishguard.io": { password: "demo", name: "Demo User", role: "IT Administrator" },
  "admin@phishguard.io": { password: "admin123", name: "Admin User", role: "Administrator" },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("phishguard_token");
      const storedUser = localStorage.getItem("phishguard_user");
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch {
          localStorage.removeItem("phishguard_token");
          localStorage.removeItem("phishguard_user");
        }
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

  const persistSession = (token: string, userData: User) => {
    localStorage.setItem("phishguard_token", token);
    localStorage.setItem("phishguard_user", JSON.stringify(userData));
    setUser(userData);
  };

  const login = useCallback(async (email: string, password: string) => {
    try {
      const res = await authAPI.login(email, password);
      persistSession(res.token, res.user);
      return;
    } catch (error) {
      console.warn("API login failed, falling back to demo login", error);
      // Demo logic fallback
      await new Promise((r) => setTimeout(r, 800));
      const demo = DEMO_USERS[email];
      if (demo && (demo.password === password || password === "")) {
        persistSession(btoa(`${email}:${Date.now()}`), { name: demo.name, email, role: demo.role });
        return;
      }
      if (email && password) {
        persistSession(btoa(`${email}:${Date.now()}`), { name: email.split("@")[0], email, role: "Analyst" });
        return;
      }
      throw new Error("Invalid email or password");
    }
  }, []);

  const signup = useCallback(async (data: { name: string; email: string; password: string; role: string }) => {
    try {
      const res = await authAPI.signup(data);
      persistSession(res.token, res.user);
      return;
    } catch (error) {
      console.warn("API signup failed, falling back to demo signup", error);
      await new Promise((r) => setTimeout(r, 800));
      if (!data.name || !data.email || !data.password) throw new Error("All fields are required");
      if (data.password.length < 8) throw new Error("Password must be at least 8 characters");
      persistSession(btoa(`${data.email}:${Date.now()}`), { name: data.name, email: data.email, role: data.role });
    }
  }, []);

  const logout = useCallback(() => {
    try {
      authAPI.logout().catch(e => console.warn(e));
    } finally {
      localStorage.removeItem("phishguard_token");
      localStorage.removeItem("phishguard_user");
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
