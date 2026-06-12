import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import api from "../../utils/api"

function RatingChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    async function fetchRating() {
      try {
        const res = await api.get("/stats/rating")
        const formatted = res.data.map((entry) => ({
          ...entry,
          dateLabel: new Date(entry.date).toLocaleDateString("en-US", {
            month: "short",
            year: "2-digit",
          }),
        }))
        setData(formatted)
      } catch (err) {
        setError("Failed to load rating history")
      } finally {
        setLoading(false)
      }
    }
    fetchRating()
  }, [])
  if (loading) {
    return <div className="bg-surface border border-border rounded-md p-4 h-64 animate-pulse mt-6" />
  }

  if (error) {
    return <div className="text-danger mt-6">{error}</div>
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-md p-4 mt-6">
        <h2 className="text-text-dim text-sm mb-3">CF Rating History</h2>
        <p className="text-text-dim text-sm">No contest history yet — link a CF handle with rated contests.</p>
      </div>
    )
  }
  return (
    <div className="bg-surface border border-border rounded-md p-4 mt-6">
      <h2 className="text-text-dim text-sm mb-3">CF Rating History</h2>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" />
          <XAxis dataKey="dateLabel" stroke="#8b949e" fontSize={12} />
          <YAxis stroke="#8b949e" fontSize={12} domain={["dataMin - 100", "dataMax + 100"]} />
          <Tooltip
            contentStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: "6px" }}
            labelStyle={{ color: "#8b949e" }}
          />
          <Line
            type="monotone"
            dataKey="newRating"
            stroke="#58a6ff"
            strokeWidth={2}
            dot={{ r: 3, fill: "#58a6ff" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RatingChart