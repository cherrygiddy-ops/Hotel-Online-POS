import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Shield, Handshake, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Role = "admin" | "partner" | "publisher";

const roles: { id: Role; label: string; icon: typeof Shield; description: string }[] = [
  { id: "admin", label: "Super Admin", icon: Shield, description: "Full platform analytics & management" },
  { id: "partner", label: "Partner", icon: Handshake, description: "Revenue sharing & embedded content" },
  { id: "publisher", label: "Publisher", icon: BookOpen, description: "Content analytics & payouts" },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role>("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "admin") navigate("/admin");
    else if (selectedRole === "partner") navigate("/partner");
    else navigate("/partner"); // publisher would have its own route
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 gradient-dark items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-primary/30"
              style={{
                width: `${200 + i * 120}px`,
                height: `${200 + i * 120}px`,
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
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
            <div className="gradient-primary rounded-xl p-3">
              <BarChart3 className="h-8 w-8 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-display text-primary-foreground">LoHo</h1>
          </div>
          <p className="text-xl text-primary-foreground/80 font-display leading-relaxed">
            Revenue Distribution & Content Metrics Platform
          </p>
          <p className="mt-4 text-primary-foreground/50 leading-relaxed">
            Fair, transparent compensation for content publishers and partners based on real user engagement.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-6">
            {[
              { label: "Publishers", value: "23+" },
              { label: "Content Items", value: "145+" },
              { label: "Active Users", value: "8.6K" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold font-display text-primary">{stat.value}</p>
                <p className="text-sm text-primary-foreground/50">{stat.label}</p>
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
            <div className="gradient-primary rounded-xl p-3">
              <BarChart3 className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display">LoHo</h1>
          </div>

          <h2 className="text-2xl font-bold font-display text-foreground">Welcome back</h2>
          <p className="mt-1 text-muted-foreground">Sign in to your dashboard</p>

          {/* Role Selection */}
          <div className="mt-6 grid grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all duration-200 ${
                  selectedRole === role.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/30"
                }`}
              >
                <role.icon className={`h-5 w-5 ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`} />
                <span className={`text-xs font-medium ${selectedRole === role.id ? "text-primary" : "text-muted-foreground"}`}>
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
            <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground font-medium border-0">
              Sign In
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Demo mode — click Sign In with any credentials
          </p>
        </motion.div>
      </div>
    </div>
  );
}
