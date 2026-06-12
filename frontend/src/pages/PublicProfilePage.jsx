import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import api from "../utils/api"

function PublicProfilePage() {
  const { username } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await api.get(`/u/${username}`)
        setData(res.data)
      } catch (err) {
        setError(err.response?.data?.error || "User not found")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [username])
  if (loading) {
    return (
      <div className="min-h-screen bg-base text-text p-8 flex items-center justify-center">
        <p className="text-text-dim">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-base text-text p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-danger">{error}</p>
        <Link to="/login" className="text-accent hover:underline">Go to Login</Link>
      </div>
    )
  }
  function getColor(count) {
    if (count === 0) return "bg-surface-2"
    if (count === 1) return "bg-green-900"
    if (count === 2) return "bg-green-700"
    if (count <= 4) return "bg-green-500"
    return "bg-green-400"
  }
  function groupByWeeks(days) {
    const weeks = []
    let currentWeek = []
    const firstDate = new Date(days[0]?.date)
    const firstDayOfWeek = firstDate.getDay()

    for (let i = 0; i < firstDayOfWeek; i++) currentWeek.push(null)

    for (const day of days) {
      currentWeek.push(day)
      if (currentWeek.length === 7) {
        weeks.push(currentWeek)
        currentWeek = []
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) currentWeek.push(null)
      weeks.push(currentWeek)
    }
    return weeks
  }

  const weeks = groupByWeeks(data.heatmap)
  return (
    <div className="min-h-screen bg-base text-text p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-1 font-mono">{data.username}</h1>
        <p className="text-text-dim mb-6">Public CP Profile</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface border border-border rounded-md p-4">
            <p className="text-text-dim text-sm">Total Solved</p>
            <p className="text-3xl font-bold mt-1 font-mono">{data.totalSolved}</p>
          </div>
          <div className="bg-surface border border-border rounded-md p-4">
            <p className="text-text-dim text-sm">Current Streak</p>
            <p className="text-3xl font-bold mt-1 font-mono">{data.streak} <span className="text-base font-normal font-sans">days</span></p>
          </div>
        </div>

        {data.platforms.length > 0 && (
          <div className="bg-surface border border-border rounded-md p-4 mb-6">
            <h2 className="text-text-dim text-sm mb-3">Linked Platforms</h2>
            <div className="flex gap-4">
              {data.platforms.map((p) => (
                <div key={p.platform} className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-accent/10 text-accent font-medium font-mono">
                    {p.platform === "codeforces" ? "CF" : "LC"}
                  </span>
                  <span className="text-text font-mono">{p.handle}</span>
                  {p.rating && <span className="text-success text-sm font-mono">({p.rating})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-surface border border-border rounded-md p-4">
          <h2 className="text-text-dim text-sm mb-3">Activity (last 365 days)</h2>
          <div className="flex gap-1 overflow-x-auto">
            {weeks.map((week, weekIdx) => (
              <div key={weekIdx} className="flex flex-col gap-1">
                {week.map((day, dayIdx) =>
                  day ? (
                    <div
                      key={dayIdx}
                      title={`${day.date}: ${day.count} solved`}
                      className={`w-3 h-3 rounded-sm ${getColor(day.count)}`}
                    />
                  ) : (
                    <div key={dayIdx} className="w-3 h-3" />
                  )
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicProfilePage