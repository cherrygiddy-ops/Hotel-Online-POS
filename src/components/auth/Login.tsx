import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { BedDouble, UtensilsCrossed, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useLogin from "@/hooks/useLogin";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const loginSchema = z.object({
  username: z.string().min(3, { message: "Provide a valid username" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type LoginData = z.infer<typeof loginSchema>;

export default function Login() {
  const [errorMessage, setErrorMessage] = useState("");
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
        email: data.username,
        password: data.password,
      });

      if (result.token === "admin") {
        navigate("/adminHome");
      } else {
        navigate("/adminHome");
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel with hotel promo */}
      <div
        className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "var(--gradient-dark)" }}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-md text-primary-foreground"
        >
          <div className="flex items-center gap-3 mb-8">
            <div
              className="rounded-xl p-3"
              style={{ background: "var(--gradient-accent)" }}
            >
              <BedDouble className="h-8 w-8 text-accent-foreground" />
            </div>
            <h1 className="text-4xl font-bold font-display">Hotel POS</h1>
          </div>
          <p className="text-xl font-display leading-relaxed">
            Manage your hotel operations
          </p>
          <p className="mt-4 text-primary-foreground/70 leading-relaxed">
            Track reservations, handle restaurant orders, and manage billing —
            all in one place.
          </p>
          <div className="mt-12 grid grid-cols-2 gap-6">
            <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <UtensilsCrossed className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Restaurant</p>
                <p className="text-xs text-primary-foreground/50 mt-0.5">
                  Orders & kitchen management
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-xl border border-accent/20 bg-accent/5 p-4">
              <CreditCard className="h-5 w-5 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium">Billing</p>
                <p className="text-xs text-primary-foreground/50 mt-0.5">
                  Invoices & payments
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Panel with login form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full max-w-md"
        >
          <h2 className="text-2xl font-bold font-display text-foreground">
            Welcome back
          </h2>
          <p className="mt-1 text-muted-foreground">
            Sign in to your hotel POS dashboard
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="staff01"
                {...register("username")}
                className="h-11"
              />
              {errors.username && (
                <p className="text-red-500 text-xs">
                  {errors.username.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                className="h-11"
              />
              {errors.password && (
                <p className="text-red-500 text-xs">
                  {errors.password.message}
                </p>
              )}
            </div>
            <Button
              className="w-full h-11 font-medium border-0 text-accent-foreground"
              style={{ background: "var(--gradient-accent)" }}
            >
              Sign In
            </Button>
          </form>

          {errorMessage && (
            <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
