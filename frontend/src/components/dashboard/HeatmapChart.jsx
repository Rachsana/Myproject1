import { useState, useEffect } from "react"
import api from "../../utils/api"

function HeatmapChart() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    async function fetchHeatmap() {
      try {
        const res = await api.get("/stats/heatmap")
        setData(res.data)
      } catch (err) {
        setError("Failed to load heatmap")
      } finally {
        setLoading(false)
      }
    }
    fetchHeatmap()
  }, [])

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

    for (let i = 0; i < firstDayOfWeek; i++) {
      currentWeek.push(null)
    }

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

  if (loading) {
    return <div className="bg-surface border border-border rounded-md p-4 h-32 animate-pulse mt-6" />
  }

  if (error) {
    return <div className="text-danger mt-6">{error}</div>
  }

  const weeks = groupByWeeks(data)

  return (
    <div className="bg-surface border border-border rounded-md p-4 mt-6">
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

      <div className="flex items-center gap-2 mt-3 text-xs text-text-dim">
        <span>Less</span>
        <div className="w-3 h-3 rounded-sm bg-surface-2" />
        <div className="w-3 h-3 rounded-sm bg-green-900" />
        <div className="w-3 h-3 rounded-sm bg-green-700" />
        <div className="w-3 h-3 rounded-sm bg-green-500" />
        <div className="w-3 h-3 rounded-sm bg-green-400" />
        <span>More</span>
      </div>
    </div>
  )
}

export default HeatmapChart