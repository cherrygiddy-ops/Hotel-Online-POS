import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Handshake, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "partner" | "publisher";

const roles: { id: Role; label: string; icon: typeof Handshake; description: string }[] = [
  { id: "partner", label: "Partner", icon: Handshake, description: "Revenue sharing & embedded content analytics" },
  { id: "publisher", label: "Publisher", icon: BookOpen, description: "Content analytics & payout tracking" },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>("publisher");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("loho-auth", "true");
    sessionStorage.setItem("loho-role", selectedRole);
    navigate(selectedRole === "partner" ? "/partner" : "/publisher");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden" style={{ background: "var(--gradient-dark)" }}>
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-accent/30"
              style={{
                width: `${160 + i * 100}px`,
                height: `${160 + i * 100}px`,
                borderRadius: "1.5rem",
                top: "50%",
                left: "50%",
                transform: `translate(-50%, -50%) rotate(${i * 15}deg)`,
              }}
            />
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="rounded-xl p-3" style={{ background: "var(--gradient-accent)" }}>
              <BarChart3 className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-display text-primary-foreground">LoHo</h1>
          </div>
          <p className="text-xl text-primary-foreground/80 font-display leading-relaxed">
            Partner & Publisher Portal
          </p>
          <p className="mt-4 text-primary-foreground/50 leading-relaxed">
            Track your revenue, monitor content performance, and manage your agreements — all in one place.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            {[
              { icon: Handshake, label: "Partners", desc: "Revenue sharing & referrals" },
              { icon: BookOpen, label: "Publishers", desc: "Content metrics & payouts" },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
                <item.icon className="h-5 w-5 text-accent mt-0.5 shrink-0" />
                <div>
                  <p className="text-sm font-medium text-primary-foreground">{item.label}</p>
                  <p className="text-xs text-primary-foreground/50 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Right Panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="rounded-xl p-3" style={{ background: "var(--gradient-accent)" }}>
              <BarChart3 className="h-6 w-6 text-accent-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display">LoHo</h1>
          </div>

          <h2 className="text-2xl font-bold font-display text-foreground">Welcome back</h2>
          <p className="mt-1 text-muted-foreground">Sign in to your dashboard</p>

          {/* Role Selection */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-all duration-200 ${
                  selectedRole === role.id
                    ? "border-accent bg-accent/5"
                    : "border-border bg-card hover:border-accent/30"
                }`}
              >
                <role.icon className={`h-6 w-6 ${selectedRole === role.id ? "text-accent" : "text-muted-foreground"}`} />
                <span className={`text-sm font-medium ${selectedRole === role.id ? "text-accent" : "text-muted-foreground"}`}>
                  {role.label}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            {roles.find((r) => r.id === selectedRole)?.description}
          </p>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@loho.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-11 font-medium border-0 text-accent-foreground"
              style={{ background: "var(--gradient-accent)" }}
            >
              Sign In as {selectedRole === "partner" ? "Partner" : "Publisher"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo mode — click Sign In with any credentials
          </p>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Admin?{" "}
            <Link to="/admin-login" className="text-primary font-medium hover:underline">
              Sign in here
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
