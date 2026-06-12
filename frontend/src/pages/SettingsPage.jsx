import { useState } from "react"
import { Link } from "react-router-dom"
import api from "../utils/api"

function SettingsPage() {
  const [cfHandle, setCfHandle] = useState("")
  const [lcHandle, setLcHandle] = useState("")
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  async function linkCF(e) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await api.post("/user/profile", { platform: "codeforces", handle: cfHandle })
      setMessage("Codeforces handle linked! Sync started — refresh dashboard in a minute.")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to link handle")
    } finally {
      setLoading(false)
    }
  }
  async function linkLC(e) {
    e.preventDefault()
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await api.post("/user/profile", { platform: "leetcode", handle: lcHandle })
      setMessage("LeetCode handle linked! Sync started — refresh dashboard in a minute.")
    } catch (err) {
      setError(err.response?.data?.error || "Failed to link handle")
    } finally {
      setLoading(false)
    }
  }
  async function triggerSync() {
    setError("")
    setMessage("")
    setLoading(true)

    try {
      await api.post("/user/sync")
      setMessage("Sync started! This may take a minute — refresh dashboard after.")
    } catch (err) {
      setError(err.response?.data?.error || "Sync failed")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-base text-text p-8">
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-border">
        <h1 className="text-2xl font-bold">settings</h1>
        <Link to="/dashboard" className="text-accent hover:underline">
          ← Back to Dashboard
        </Link>
      </div>

      {message && (
        <div className="bg-success/10 text-success p-3 rounded mb-4 text-sm max-w-md border border-success/30">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-danger/10 text-danger p-3 rounded mb-4 text-sm max-w-md border border-danger/30">
          {error}
        </div>
      )}

      <div className="bg-surface border border-border rounded-md p-6 max-w-md mb-6">
        <h2 className="text-lg font-semibold mb-3">Codeforces Handle</h2>
        <form onSubmit={linkCF} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. tourist"
            value={cfHandle}
            onChange={(e) => setCfHandle(e.target.value)}
            className="bg-surface-2 text-text p-3 rounded outline-none focus:ring-2 focus:ring-accent border border-border flex-1 font-mono"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-base px-4 rounded font-semibold disabled:opacity-50 transition-colors"
          >
            Link
          </button>
        </form>
      </div>

      <div className="bg-surface border border-border rounded-md p-6 max-w-md mb-6">
        <h2 className="text-lg font-semibold mb-3">LeetCode Handle</h2>
        <form onSubmit={linkLC} className="flex gap-2">
          <input
            type="text"
            placeholder="e.g. neal_wu"
            value={lcHandle}
            onChange={(e) => setLcHandle(e.target.value)}
            className="bg-surface-2 text-text p-3 rounded outline-none focus:ring-2 focus:ring-accent border border-border flex-1 font-mono"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-accent hover:bg-accent-hover text-base px-4 rounded font-semibold disabled:opacity-50 transition-colors"
          >
            Link
          </button>
        </form>
      </div>

      <button
        onClick={triggerSync}
        disabled={loading}
        className="bg-surface-2 hover:bg-surface border border-border text-text px-4 py-3 rounded font-semibold disabled:opacity-50 transition-colors"
      >
        Manual Sync Now
      </button>
    </div>
  )
}

export default SettingsPage