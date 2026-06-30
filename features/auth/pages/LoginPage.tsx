"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthCard } from "../components/AuthCard";
import { InputField, PasswordField } from "../components/FormInputs";
import { ProviderButton, FormDivider } from "../components/ProviderButton";
import { useRouter } from "next/navigation";

export function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate backend auth delay, then redirect to dashboard
    setTimeout(() => {
      setIsLoading(false);
      router.push("/demo");
    }, 1200);
  };

  const handleProviderLogin = (provider: string) => {
    console.log(`Connecting to ${provider} API...`);
    // Future backend integration
  };

  const Footer = () => (
    <div className="flex flex-col gap-6">
      <FormDivider />
      <div className="flex flex-col gap-3">
        <ProviderButton provider="Microsoft" onClick={() => handleProviderLogin("Microsoft")} />
        <ProviderButton provider="Google" onClick={() => handleProviderLogin("Google")} />
      </div>
      <p className="text-center text-[13px] font-medium text-slate-400 mt-2">
        Don't have an organization?{" "}
        <Link href="/auth/register" className="text-brand hover:text-brand-hover font-bold transition-colors">
          Initialize Workspace
        </Link>
      </p>
    </div>
  );

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to your IndustroMind enterprise workspace."
      submitLabel="Sign In"
      isLoading={isLoading}
      onSubmit={handleLogin}
      footer={<Footer />}
    >
      <InputField
        label="Work Email"
        type="email"
        placeholder="admin@industromind.ai"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <div className="flex flex-col gap-1">
        <PasswordField
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <div className="flex items-center justify-between mt-2 px-1">
          <label className="flex items-center gap-2 cursor-pointer group">
            <input 
              type="checkbox" 
              className="w-4 h-4 rounded border-slate-700 bg-slate-900/50 checked:bg-brand checked:border-brand focus:ring-brand/50 transition-colors"
            />
            <span className="text-[12px] font-medium text-slate-400 group-hover:text-slate-300 transition-colors">Remember me</span>
          </label>
          <Link href="/auth/forgot-password" className="text-[12px] font-bold text-brand hover:text-brand-hover transition-colors">
            Forgot Password?
          </Link>
        </div>
      </div>
    </AuthCard>
  );
}
