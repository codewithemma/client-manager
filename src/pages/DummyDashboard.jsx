import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

// 1. Array of Dummy Data
const DUMMY_CLIENTS = [
  {
    id: "1",
    name: "Amina Bello",
    company: "Zenith Innovations",
    email: "amina@zenith.ng",
    phone: "+234 803 123 4567",
    status: "Active",
  },
  {
    id: "2",
    name: "Chinedu Okafor",
    company: "Lagos Logistics",
    email: "chinedu@lagoslogistics.com",
    phone: "+234 805 987 6543",
    status: "Prospect",
  },
  {
    id: "3",
    name: "Folake Adebayo",
    company: "Eko Creative Agency",
    email: "folake@ekocreative.ng",
    phone: "+234 812 345 6789",
    status: "Active",
  },
  {
    id: "4",
    name: "Tunde Bakare",
    company: "Savannah Agrotech",
    email: "tunde@savannahagro.org",
    phone: "+234 818 111 2233",
    status: "Prospect",
  },
];

const STATUSES = ["All", "Prospect", "Active"];

const fieldClass =
  "rounded-lg bg-[#0B0E14] border border-[#232A38] px-3 py-2 text-sm text-[#E7EAF0] placeholder:text-[#5B6473] focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]";

export default function DummyDashboard() {
  // 2. Initialize list state with dummy data instead of an empty array
  const [list, setList] = useState(DUMMY_CLIENTS);
  const [loading, setLoading] = useState(false); // Set to false since data is already here
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("All");

  // Fixed: Initialized with an empty string to prevent query.toLowerCase() crashes
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

  // Mocked user object directly here to remove dependency on AuthContext
  const user = { firstName: "Developer" };
  const navigate = useNavigate();

  // Mock Logout handler
  async function handleLogout() {
    navigate("/");
  }

  // Mock Add handler that updates local state directly
  async function handleAdd(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const newClient = {
        ...form,
        id: Date.now().toString(),
      };

      // Prepend the new client to our active state list
      setList((prevList) => [newClient, ...prevList]);

      // Reset form
      setForm({
        name: "",
        company: "",
        email: "",
        phone: "",
        status: "Prospect",
      });
      setShowForm(false);
    } catch (err) {
      setError("Failed to add client.");
    } finally {
      setSaving(false);
    }
  }

  // Mock Delete handler that updates local state directly
  async function handleDelete(id, e) {
    e.stopPropagation();
    if (!confirm("Remove this client?")) return;

    setList((l) => l.filter((c) => (c.id ?? c._id) !== id));
  }

  // Filter client list based on active filter and query parameters
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
            No clients found. Add your first one above.
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
