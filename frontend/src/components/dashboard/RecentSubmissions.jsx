import { useState, useEffect } from "react"
import api from "../../utils/api"

function RecentSubmissions() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchRecent() {
      try {
        const res = await api.get("/stats/recent")
        setData(res.data)
      } catch (err) {
        setError("Failed to load recent submissions")
      } finally {
        setLoading(false)
      }
    }
    fetchRecent()
  }, [])

  function formatDate(dateStr) {
    return new Date(dateStr).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  function platformColor(platform) {
    return platform === "codeforces" ? "bg-accent/10 text-accent" : "bg-success/10 text-success"
  }

  if (loading) {
    return <div className="bg-surface border border-border rounded-md p-4 h-64 animate-pulse mt-6" />
  }

  if (error) {
    return <div className="text-danger mt-6">{error}</div>
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-md p-4 mt-6">
        <h2 className="text-text-dim text-sm mb-3">Recent Submissions</h2>
        <p className="text-text-dim text-sm">No accepted submissions yet.</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-md p-4 mt-6">
      <h2 className="text-text-dim text-sm mb-3">Recent Submissions</h2>

      <div className="flex flex-col gap-2">
        {data.map((sub, idx) => (
          <div
            key={idx}
            className="flex items-center justify-between bg-surface-2 border border-border rounded p-3"
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className={`text-xs px-2 py-1 rounded font-medium font-mono ${platformColor(sub.platform)}`}>
                {sub.platform === "codeforces" ? "CF" : "LC"}
              </span>
              <span className="text-text text-sm truncate">{sub.problemName}</span>
              {sub.difficulty && (
                <span className="text-text-dim text-xs whitespace-nowrap font-mono">{sub.difficulty}</span>
              )}
            </div>
            <span className="text-text-dim text-xs whitespace-nowrap ml-3 font-mono">
              {formatDate(sub.solvedAt)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecentSubmissions