import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { BarChart3, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLogin from "@/hooks/useLogin"; // same hook you use for publisher login
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().email({ message: "Provide a valid email" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginData = z.infer<typeof loginSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const login = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    try {
      const result = await login.mutateAsync({
        email: data.email,
        password: data.password
      });

      // Save JWT token + role
      sessionStorage.setItem("loho-token", result.token);
      sessionStorage.setItem("loho-role", "admin");

      // Navigate directly to admin dashboard
      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Admin login failed. Please check credentials.");
    }
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
            Admin Control Center
          </p>
          <p className="mt-4 text-primary-foreground/50 leading-relaxed">
            Full platform analytics, revenue management, publisher oversight and system configuration.
          </p>
          <div className="mt-12 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
            <Shield className="h-6 w-6 text-primary" />
            <p className="text-sm text-primary-foreground/70">
              This portal is restricted to authorized administrators only.
            </p>
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
          <h2 className="text-2xl font-bold font-display text-foreground">Welcome back, Admin</h2>
          <p className="mt-1 text-muted-foreground">Sign in to manage the platform</p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="admin@loho.com" {...register("email")} className="h-11" />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" placeholder="••••••••" {...register("password")} className="h-11" />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full h-11 gradient-primary text-primary-foreground font-medium border-0">
              Sign In
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
