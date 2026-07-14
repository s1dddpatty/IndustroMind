"use client";

import { useState } from "react";
import axios from "axios";
import "@/lib/api";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [orgName, setOrgName] = useState("");
  const [plantName, setPlantName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  // Store token in state so steps 4 & 5 can use it directly without
  // depending on the interceptor reading from localStorage
  const [authToken, setAuthToken] = useState("");

  const handleNext = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (step === 1) {
        setStep(2);
      } else if (step === 2) {
        setStep(3);
      } else if (step === 3) {
        // Register user or login if already exists
        let token = "";
        try {
          const res = await axios.post("/api/v1/auth/register", { email, name, password });
          token = res.data?.data?.access_token || res.data?.data?.token || res.data?.token || "";
        } catch (regErr: any) {
          if (regErr.response?.status === 409 || regErr.response?.status === 400 || regErr.response?.status === 422) {
            // User already exists — fall back to login
            const loginRes = await axios.post("/api/v1/auth/login", { email, password });
            token = loginRes.data?.data?.access_token || loginRes.data?.data?.token || loginRes.data?.token || "";
          } else {
            throw regErr;
          }
        }
        if (token) {
          localStorage.setItem("token", token);
          localStorage.setItem("access_token", token);
          setAuthToken(token); // store in state for immediate use in steps 4/5
          console.log("Successfully authenticated and stored token:", token.substring(0, 15) + "...");
          setStep(4);
        } else {
          setError("No authentication token was returned by the server. Please check your credentials.");
        }
      } else if (step === 4) {
        // Create Org — pass token explicitly in header
        const token = authToken || localStorage.getItem("token") || localStorage.getItem("access_token") || "";
        console.log("Auth token for creating organization:", token ? token.substring(0, 15) + "..." : "EMPTY");
        if (!token) {
          setError("Authentication token is missing. Please try logging in again.");
          return;
        }
        await axios.post(
          "/api/v1/organizations",
          { name: orgName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStep(5);
      } else if (step === 5) {
        // Create Plant — pass token explicitly in header
        const token = authToken || localStorage.getItem("token") || localStorage.getItem("access_token") || "";
        console.log("Auth token for creating plant:", token ? token.substring(0, 15) + "..." : "EMPTY");
        if (!token) {
          setError("Authentication token is missing. Please try logging in again.");
          return;
        }
        await axios.post(
          "/api/v1/plants",
          { name: plantName },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        router.push("/onboarding/ai");
      }
    } catch (err: any) {
      const msg = err?.response?.data?.detail || err?.response?.data?.message || err?.message || "Something went wrong";
      setError(String(msg));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e141a] text-[#dde3eb]">
      <div className="w-full max-w-md p-8 bg-[#161c22] rounded-xl border border-[#334155]">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-[#89ceff]">NeuroPlant</h1>
          <p className="text-sm text-[#88929b] mt-2">Get started with your intelligence platform</p>
        </div>

        <form onSubmit={handleNext} className="space-y-4">
          {step === 1 && (
            <div>
              <label className="block text-sm font-medium mb-1">Work Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#0e141a] border border-[#334155] rounded-md px-3 py-2 text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none"
                placeholder="you@company.com"
              />
            </div>
          )}
          {step === 2 && (
            <div>
              <label className="block text-sm font-medium mb-1">Verification Code</label>
              <input
                type="text"
                required
                className="w-full bg-[#0e141a] border border-[#334155] rounded-md px-3 py-2 text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none"
                placeholder="000000"
              />
              <p className="text-xs text-[#88929b] mt-2">Sent to {email}</p>
            </div>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#0e141a] border border-[#334155] rounded-md px-3 py-2 text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#0e141a] border border-[#334155] rounded-md px-3 py-2 text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none"
                />
              </div>
            </>
          )}
          {step === 4 && (
            <div>
              <label className="block text-sm font-medium mb-1">Organization Name</label>
              <input
                type="text"
                required
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full bg-[#0e141a] border border-[#334155] rounded-md px-3 py-2 text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none"
              />
            </div>
          )}
          {step === 5 && (
            <div>
              <label className="block text-sm font-medium mb-1">First Plant Name</label>
              <input
                type="text"
                required
                value={plantName}
                onChange={(e) => setPlantName(e.target.value)}
                className="w-full bg-[#0e141a] border border-[#334155] rounded-md px-3 py-2 text-[#dde3eb] focus:border-[#0ea5e9] focus:outline-none"
              />
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-950/50 border border-red-950 text-red-300 rounded-md text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#0ea5e9] text-white rounded-md py-2 font-medium hover:bg-[#006591] disabled:opacity-50"
          >
            {loading ? "Processing..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
