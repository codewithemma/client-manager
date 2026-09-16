import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { clients as clientsApi, auth } from "../api";
import { useAuth } from "../context/AuthContext";

import Logo from "../components/Logo";

const STATUSES = ["All", "Prospect", "Active"];
const fieldClass =
  "rounded-lg bg-[#0B0E14] border border-[#232A38] px-3 py-2 text-sm text-[#E7EAF0] placeholder:text-[#5B6473] focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]";

export default function Dashboard() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    status: "Prospect",
  });
  const [saving, setSaving] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await clientsApi.list();
      setList(Array.isArray(data) ? data : (data?.clients ?? []));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function handleLogout() {
    try {
      await auth.logout();
    } catch {
      // still sign out locally even if the request fails
    }
    signOut();
    navigate("/");
  }

  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await clientsApi.create(form);
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "Prospect",
      });
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm("Remove this client?")) return;
    try {
      await clientsApi.remove(id);
      setList((l) => l.filter((c) => (c.id ?? c._id) !== id));
    } catch (err) {
      setError(err.message);
    }
  }

  const filtered = list.filter((c) => {
    const matchesStatus = filter === "All" || c.status === filter;
    const haystack = `${c.name ?? ""} ${c.company ?? ""}`.toLowerCase();
    const matchesQuery = haystack.includes(query.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <header className="border-b border-[#232A38] px-6 py-4 flex items-center justify-between">
        <Logo size={26} />
        <div className="flex items-center gap-4">
          {user?.firstName && (
            <span className="text-sm text-[#8B94A5] hidden sm:inline">
              Hi, {user.firstName}
            </span>
          )}
          <button
            onClick={handleLogout}
            className="text-sm text-[#8B94A5] hover:text-[#E7EAF0]"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-semibold text-[#E7EAF0]">Clients</h1>
          <button
            onClick={() => setShowForm((s) => !s)}
            className="rounded-lg bg-[#7DD3FC] text-[#0B0E14] text-sm font-medium px-4 py-2 hover:bg-[#38BDF8] transition-colors"
          >
            {showForm ? "Cancel" : "+ New client"}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={handleAdd}
            className="mb-6 bg-[#12161F] border border-[#232A38] rounded-xl p-5 grid grid-cols-1 sm:grid-cols-2 gap-3"
          >
            <input
              required
              placeholder="Client name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={fieldClass}
            />
            <input
              placeholder="Company"
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className={fieldClass}
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={fieldClass}
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={fieldClass}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className={fieldClass}
            >
              <option>Prospect</option>
              <option>Active</option>
            </select>
            <button
              disabled={saving}
              type="submit"
              className="rounded-lg bg-[#7DD3FC] text-[#0B0E14] text-sm font-medium px-4 py-2 hover:bg-[#38BDF8] transition-colors sm:col-span-2 disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save client"}
            </button>
          </form>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search clients…"
            className={`flex-1 ${fieldClass} bg-[#12161F]`}
          />
          <div className="flex gap-2">
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`px-3 py-2 rounded-lg text-sm border transition-colors ${
                  filter === s
                    ? "bg-[#7DD3FC] text-[#0B0E14] border-[#7DD3FC]"
                    : "bg-transparent text-[#8B94A5] border-[#232A38] hover:text-[#E7EAF0]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-sm text-[#F87171] mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-[#8B94A5]">Loading clients…</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-[#8B94A5]">
            No clients yet. Add your first one above.
          </p>
        ) : (
          <ul className="divide-y divide-[#232A38] border border-[#232A38] rounded-xl overflow-hidden">
            {filtered.map((c) => {
              const id = c.id ?? c._id;
              return (
                <li
                  key={id}
                  onClick={() => navigate(`/clients/${id}`)}
                  className="flex items-center justify-between px-4 py-3 bg-[#12161F] hover:bg-[#171D28] cursor-pointer transition-colors"
                >
                  <div>
                    <p className="text-sm font-medium text-[#E7EAF0]">
                      {c.name}
                    </p>
                    <p className="text-xs text-[#8B94A5]">{c.company}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${
                        c.status === "Active"
                          ? "text-[#34D399] border-[#34D399]/40 bg-[#34D399]/10"
                          : "text-[#FBBF24] border-[#FBBF24]/40 bg-[#FBBF24]/10"
                      }`}
                    >
                      {c.status}
                    </span>
                    <button
                      onClick={(e) => handleDelete(id, e)}
                      className="text-xs text-[#8B94A5] hover:text-[#F87171]"
                    >
                      Remove
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}
