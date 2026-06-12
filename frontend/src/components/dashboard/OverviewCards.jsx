import { useState, useEffect } from "react"
import api from "../../utils/api"

function OverviewCards() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    async function fetchOverview() {
      try {
        const res = await api.get("/stats/overview")
        setData(res.data)
      } catch (err) {
        setError("Failed to load stats")
      } finally {
        setLoading(false)
      }
    }
    fetchOverview()
  }, [])
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-surface border border-border rounded-md p-4 h-24 animate-pulse" />
        ))}
      </div>
    )
  }
  if (error) {
    return <div className="text-danger">{error}</div>
  }
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-surface border border-border rounded-md p-4">
        <p className="text-text-dim text-sm">Total Solved</p>
        <p className="text-3xl font-bold text-text mt-1 font-mono">{data.totalSolved}</p>
      </div>

      <div className="bg-surface border border-border rounded-md p-4">
        <p className="text-text-dim text-sm">Codeforces</p>
        <p className="text-3xl font-bold text-text mt-1 font-mono">{data.cfSolved}</p>
      </div>

      <div className="bg-surface border border-border rounded-md p-4">
        <p className="text-text-dim text-sm">LeetCode</p>
        <p className="text-3xl font-bold text-text mt-1 font-mono">{data.lcSolved}</p>
      </div>

      <div className="bg-surface border border-border rounded-md p-4">
        <p className="text-text-dim text-sm">Current Streak</p>
        <p className="text-3xl font-bold text-text mt-1 font-mono">
          {data.streak} <span className="text-base font-normal font-sans">days</span>
        </p>
      </div>

      {data.cfRating && (
        <div className="bg-surface border border-border rounded-md p-4 col-span-2">
          <p className="text-text-dim text-sm">CF Rating</p>
          <p className="text-3xl font-bold text-success mt-1 font-mono">{data.cfRating}</p>
        </div>
      )}
    </div>
  )
}

export default OverviewCards