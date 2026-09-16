import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../api";

import Logo from "../components/Logo";
import { useAuth } from "../context/AuthContext";

const inputClass =
  "w-full rounded-lg bg-[#0B0E14] border border-[#232A38] px-3 py-2 text-sm text-[#E7EAF0] placeholder:text-[#5B6473] focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]";

export default function Login() {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data =
        mode === "signin"
          ? await auth.login({ email: form.email, password: form.password })
          : await auth.signup(form);
      // Assumes the API returns { token, user }. Adjust if the shape differs.
      signIn(data?.token, data?.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <Logo size={44} />
          <p className="mt-3 text-sm text-[#8B94A5] tracking-wide">
            Build · Connect · Grow
          </p>
        </div>

        <div className="bg-[#12161F] border border-[#232A38] rounded-xl p-6">
          <h1 className="text-lg font-semibold text-[#E7EAF0] mb-5">
            {mode === "signin"
              ? "Sign in to your clients"
              : "Create your account"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === "signup" && (
              <div className="grid grid-cols-2 gap-3">
                <input
                  value={form.firstName}
                  onChange={update("firstName")}
                  placeholder="First name"
                  required
                  className={inputClass}
                />
                <input
                  value={form.lastName}
                  onChange={update("lastName")}
                  placeholder="Last name"
                  required
                  className={inputClass}
                />
              </div>
            )}
            <input
              type="email"
              value={form.email}
              onChange={update("email")}
              placeholder="Email"
              required
              className={inputClass}
            />
            <input
              type="password"
              value={form.password}
              onChange={update("password")}
              placeholder="Password"
              required
              className={inputClass}
            />

            {error && <p className="text-sm text-[#F87171]">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-[#7DD3FC] text-[#0B0E14] font-medium py-2 text-sm hover:bg-[#38BDF8] transition-colors disabled:opacity-60"
            >
              {loading
                ? "Please wait…"
                : mode === "signin"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <button
            onClick={() => {
              setMode(mode === "signin" ? "signup" : "signin");
              setError("");
            }}
            className="w-full text-center text-sm text-[#8B94A5] hover:text-[#E7EAF0] mt-4"
          >
            {mode === "signin"
              ? "New here? Create an account"
              : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
