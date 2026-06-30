"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AuthCard } from "../components/AuthCard";
import { InputField, PasswordField, SelectField } from "../components/FormInputs";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

const INDUSTRY_OPTIONS = [
  { label: "Oil & Gas", value: "oil-gas" },
  { label: "Petrochemical", value: "petrochemical" },
  { label: "Chemical", value: "chemical" },
  { label: "Steel", value: "steel" },
  { label: "Power", value: "power" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Mining", value: "mining" },
  { label: "Pharmaceutical", value: "pharma" },
  { label: "Food Processing", value: "food" },
  { label: "Water Treatment", value: "water" }
];

export function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    orgName: "",
    industry: "",
    plants: "",
    adminName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate backend auth/organization creation delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/demo");
    }, 1500);
  };

  const Footer = () => (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="flex items-center gap-2 mt-2">
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-[12px] font-medium text-slate-400">SOC2 Type II Certified Platform</span>
      </div>
      <p className="text-center text-[13px] font-medium text-slate-400">
        Already have an organization?{" "}
        <Link href="/auth/login" className="text-brand hover:text-brand-hover font-bold transition-colors">
          Sign In
        </Link>
      </p>
    </div>
  );

  return (
    <div className="py-8 w-full">
      <AuthCard
        title="Initialize Digital Plant"
        subtitle="Create your IndustroMind enterprise workspace."
        submitLabel="Create Workspace"
        isLoading={isLoading}
        onSubmit={handleRegister}
        footer={<Footer />}
      >
        
        {/* Organization Section */}
        <div className="flex flex-col gap-4">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">Organization Details</h3>
          <InputField
            label="Organization Name"
            name="orgName"
            placeholder="e.g. Acme Refining Co."
            value={formData.orgName}
            onChange={handleChange}
            required
          />
          <div className="grid grid-cols-2 gap-4">
            <SelectField
              label="Industry"
              name="industry"
              options={INDUSTRY_OPTIONS}
              value={formData.industry}
              onChange={handleChange}
              required
            />
            <InputField
              label="Number of Plants"
              name="plants"
              type="number"
              min="1"
              placeholder="e.g. 3"
              value={formData.plants}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* Administrator Section */}
        <div className="flex flex-col gap-4 mt-2">
          <h3 className="text-[10px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-800 pb-2">Administrator Account</h3>
          <InputField
            label="Full Name"
            name="adminName"
            placeholder="John Doe"
            value={formData.adminName}
            onChange={handleChange}
            required
          />
          <InputField
            label="Work Email"
            name="email"
            type="email"
            placeholder="admin@acme.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <PasswordField
            label="Password"
            name="password"
            placeholder="Create a secure password"
            value={formData.password}
            onChange={handleChange}
            showStrength
            required
          />
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
            error={
              formData.confirmPassword && formData.password !== formData.confirmPassword 
                ? "Passwords do not match" 
                : undefined
            }
          />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-3 mt-2 px-1">
          <input 
            type="checkbox" 
            required
            className="w-4 h-4 mt-0.5 rounded border-slate-700 bg-slate-900/50 checked:bg-brand checked:border-brand focus:ring-brand/50 transition-colors"
          />
          <p className="text-[11px] font-medium text-slate-400 leading-relaxed">
            By creating an organization, you agree to the{" "}
            <a href="#" className="text-brand hover:underline">Master Services Agreement</a> and{" "}
            <a href="#" className="text-brand hover:underline">Data Processing Addendum</a>.
          </p>
        </div>

      </AuthCard>
    </div>
  );
}
