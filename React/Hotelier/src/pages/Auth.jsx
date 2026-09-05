import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Mail, Lock, User, ArrowRight } from "lucide-react";


export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const { login, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || (!isForgotPassword && !password) || (!isLogin && !isForgotPassword && !name)) {
      toast.error("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    try {
      if (isForgotPassword) {
        // Firebase Password Reset Simulation
        await new Promise(r => setTimeout(r, 600));
        toast.success("Password reset email sent successfully!");
        setIsForgotPassword(false);
        setIsLogin(true);
      } else if (isLogin) {
        await login(email, password);
        toast.success("Successfully logged in!");
        navigate(redirectPath, { replace: true });
      } else {
        await register(name, email, password);
        toast.success("Account created successfully!");
        navigate(redirectPath, { replace: true });
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Authentication failed. Please check credentials.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await loginWithGoogle();
      toast.success("Google Sign-In successful!");
      navigate(redirectPath, { replace: true });
    } catch (error) {
      console.error(error);
      toast.error("Google Sign-In failed.");
    }
  };

  return (
    <div className="min-h-screen flex items-stretch bg-slate-50 dark:bg-slate-950">
      {/* Left panel: Image showcase (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 overflow-hidden">
        <img
          src="https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
          alt="Luxury Hotel"
          className="absolute inset-0 w-full h-full object-cover opacity-80 zoom-animation"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>
        <div className="absolute bottom-16 left-16 right-16 z-10 text-white">
          <span className="px-4 py-1.5 rounded-full bg-primary/20 border border-primary/30 text-primary-light text-xs font-semibold uppercase tracking-wider">
            Premium Living
          </span>
          <h2 className="text-4xl font-extrabold mt-6 leading-tight font-sans tracking-wide uppercase">
            Unlock the gateway to luxury and comfort.
          </h2>
          <p className="mt-4 text-slate-300 text-sm leading-relaxed max-w-md">
            Join our exclusive club to get access to custom discounts, manage bookings in real time, and save favorite rooms.
          </p>
        </div>
      </div>

      {/* Right panel: Auth Forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 md:p-16">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <span className="text-3xl font-extrabold tracking-widest bg-gradient-to-r from-primary-dark via-primary to-primary-light bg-clip-text text-transparent uppercase">
              Hotelier
            </span>
            <h1 className="text-2xl font-bold mt-4 text-slate-900 dark:text-white uppercase tracking-wider">
              {isForgotPassword
                ? "Reset your password"
                : isLogin
                ? "Sign in to your account"
                : "Create an account"}
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              {isForgotPassword
                ? "Enter your email to receive a recovery link."
                : isLogin
                ? "Welcome back! Enter your details to continue."
                : "Enter details below to start your premium experience."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && !isForgotPassword && (
              <div className="space-y-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-950 dark:text-white focus:outline-none"
                />
              </div>
            </div>

            {!isForgotPassword && (
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => setIsForgotPassword(true)}
                      className="text-xs text-primary hover:text-primary-dark font-semibold"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-slate-950 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary hover:bg-primary-dark disabled:bg-slate-400 text-white rounded-2xl py-4 font-bold uppercase tracking-widest text-sm flex items-center justify-center space-x-2 transition duration-200 shadow-lg shadow-primary/20"
            >
              <span>{submitting ? "Processing..." : isForgotPassword ? "Send Link" : isLogin ? "Sign In" : "Register"}</span>
              {!submitting && <ArrowRight size={16} />}
            </button>
          </form>

          {!isForgotPassword && (
            <>
              {/* Divider */}
              <div className="flex items-center space-x-3 my-6">
                <hr className="flex-grow border-slate-200 dark:border-slate-800" />
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">or continue with</span>
                <hr className="flex-grow border-slate-200 dark:border-slate-800" />
              </div>

              {/* Google Sign In */}
              <button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center space-x-3 py-3.5 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-350 transition duration-200 font-semibold text-sm cursor-pointer"
              >
                <svg className="w-4.5 h-4.5 fill-current mr-1 text-red-500" viewBox="0 0 24 24">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-6.887 4.114-4.64 0-8.4-3.76-8.4-8.4s3.76-8.4 8.4-8.4c2.25 0 4.3.85 5.85 2.4l3.15-3.15C18.66.97 15.62 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.91 0 12.24-4.87 12.24-12.24 0-.83-.08-1.63-.24-2.4H12.24z"/>
                </svg>
                <span>Sign in with Google</span>
              </button>
            </>
          )}

          {/* Toggle modes */}
          <div className="text-center text-sm font-semibold mt-8">
            {isForgotPassword ? (
              <button
                onClick={() => {
                  setIsForgotPassword(false);
                  setIsLogin(true);
                }}
                className="text-primary hover:underline"
              >
                Back to Login
              </button>
            ) : isLogin ? (
              <p className="text-slate-550">
                Don't have an account?{" "}
                <button onClick={() => setIsLogin(false)} className="text-primary hover:underline font-bold">
                  Sign up
                </button>
              </p>
            ) : (
              <p className="text-slate-550">
                Already have an account?{" "}
                <button onClick={() => setIsLogin(true)} className="text-primary hover:underline font-bold">
                  Sign in
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
