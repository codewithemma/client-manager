import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { clients as clientsApi, notes as notesApi } from "../api";
import Logo from "../components/Logo";

const fieldClass =
  "w-full rounded-lg bg-[#0B0E14] border border-[#232A38] px-3 py-2 text-sm text-[#E7EAF0] placeholder:text-[#5B6473] focus:outline-none focus:ring-2 focus:ring-[#7DD3FC]";

export default function ClientDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [client, setClient] = useState(null);
  const [noteList, setNoteList] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await clientsApi.get(id);
      setClient(data);
      setForm(data);
      try {
        const n = await notesApi.list(id);
        setNoteList(Array.isArray(n) ? n : (n?.notes ?? []));
      } catch {
        setNoteList([]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function handleSave(e) {
    e.preventDefault();
    try {
      const updated = await clientsApi.update(id, form);
      setClient(updated ?? form);
      setEditing(false);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete() {
    if (!confirm("Delete this client and their notes?")) return;
    try {
      await clientsApi.remove(id);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleAddNote(e) {
    e.preventDefault();
    if (!noteText.trim()) return;
    setSavingNote(true);
    try {
      const created = await notesApi.create(id, noteText.trim());
      setNoteList((n) => [created ?? { content: noteText.trim() }, ...n]);
      setNoteText("");
    } catch (err) {
      setError(err.message);
    } finally {
      setSavingNote(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex items-center justify-center text-sm text-[#8B94A5]">
        Loading…
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center gap-3">
        <p className="text-sm text-[#F87171]">{error || "Client not found."}</p>
        <Link to="/dashboard" className="text-sm text-[#7DD3FC]">
          Back to clients
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <header className="border-b border-[#232A38] px-6 py-4 flex items-center justify-between">
        <Link
          to="/dashboard"
          className="text-sm text-[#8B94A5] hover:text-[#E7EAF0]"
        >
          ← Back
        </Link>
        <Logo size={22} />
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8">
        {error && <p className="text-sm text-[#F87171] mb-4">{error}</p>}

        <div className="bg-[#12161F] border border-[#232A38] rounded-xl p-5 mb-6">
          {!editing ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-lg font-semibold text-[#E7EAF0]">
                    {client.name}
                  </h1>
                  <p className="text-sm text-[#8B94A5]">{client.company}</p>
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full border ${
                    client.status === "Active"
                      ? "text-[#34D399] border-[#34D399]/40 bg-[#34D399]/10"
                      : "text-[#FBBF24] border-[#FBBF24]/40 bg-[#FBBF24]/10"
                  }`}
                >
                  {client.status}
                </span>
              </div>
              <div className="mt-3 text-sm text-[#8B94A5] space-y-1">
                <p>{client.email}</p>
                <p>{client.phone}</p>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => setEditing(true)}
                  className="text-sm text-[#7DD3FC] hover:text-[#38BDF8]"
                >
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="text-sm text-[#F87171] hover:text-[#EF4444]"
                >
                  Delete client
                </button>
              </div>
            </>
          ) : (
            <form onSubmit={handleSave} className="space-y-3">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className={fieldClass}
                placeholder="Name"
              />
              <input
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
                className={fieldClass}
                placeholder="Company"
              />
              <input
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={fieldClass}
                placeholder="Email"
              />
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className={fieldClass}
                placeholder="Phone"
              />
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className={fieldClass}
              >
                <option>Prospect</option>
                <option>Active</option>
              </select>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-[#7DD3FC] text-[#0B0E14] text-sm font-medium px-4 py-2 hover:bg-[#38BDF8]"
                >
                  Save changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(false);
                    setForm(client);
                  }}
                  className="text-sm text-[#8B94A5] hover:text-[#E7EAF0]"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        <div>
          <h2 className="text-sm font-semibold text-[#E7EAF0] mb-3">Notes</h2>
          <form onSubmit={handleAddNote} className="flex gap-2 mb-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Add a note about this client…"
              rows={2}
              className={`${fieldClass} resize-none bg-[#12161F]`}
            />
            <button
              disabled={savingNote}
              type="submit"
              className="rounded-lg bg-[#7DD3FC] text-[#0B0E14] text-sm font-medium px-4 hover:bg-[#38BDF8] disabled:opacity-60"
            >
              Add
            </button>
          </form>

          {noteList.length === 0 ? (
            <p className="text-sm text-[#8B94A5]">No notes yet.</p>
          ) : (
            <ul className="space-y-3">
              {noteList.map((n, i) => (
                <li
                  key={n.id ?? n._id ?? i}
                  className="bg-[#12161F] border border-[#232A38] rounded-lg px-4 py-3"
                >
                  <p className="text-sm text-[#E7EAF0]">
                    {n.content ?? n.text}
                  </p>
                  {n.createdAt && (
                    <p className="text-xs text-[#5B6473] mt-1">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
