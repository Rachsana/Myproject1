import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import api from "../../utils/api"

function TagsChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  useEffect(() => {
    async function fetchTags() {
      try {
        const res = await api.get("/stats/tags")
        setData(res.data.slice(0, 15))
      } catch (err) {
        setError("Failed to load tags")
      } finally {
        setLoading(false)
      }
    }
    fetchTags()
  }, [])
  if (loading) {
    return <div className="bg-surface border border-border rounded-md p-4 h-80 animate-pulse mt-6" />
  }

  if (error) {
    return <div className="text-danger mt-6">{error}</div>
  }

  if (data.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-md p-4 mt-6">
        <h2 className="text-text-dim text-sm mb-3">Topic Distribution</h2>
        <p className="text-text-dim text-sm">No tagged submissions yet.</p>
      </div>
    )
  }
  return (
    <div className="bg-surface border border-border rounded-md p-4 mt-6">
      <h2 className="text-text-dim text-sm mb-3">Topic Distribution (weakest first)</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#30363d" horizontal={false} />
          <XAxis type="number" stroke="#8b949e" fontSize={12} />
          <YAxis
            type="category"
            dataKey="tag"
            stroke="#8b949e"
            fontSize={12}
            width={100}
          />
          <Tooltip
            contentStyle={{ backgroundColor: "#161b22", border: "1px solid #30363d", borderRadius: "6px" }}
            labelStyle={{ color: "#8b949e" }}
          />
          <Bar dataKey="count" fill="#58a6ff" radius={[0, 4, 4, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default TagsChart