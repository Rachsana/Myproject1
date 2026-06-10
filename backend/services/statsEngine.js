function calculateStreak(submissions) {
  if (submissions.length === 0) return 0

  const dates = [
    ...new Set(
      submissions.map((s) => s.solvedAt.toISOString().split("T")[0])
    ),
  ].sort((a, b) => (a > b ? -1 : 1)) // sort latest first

  let streak = 0
  let current = new Date()
  current.setHours(0, 0, 0, 0)

  for (const dateStr of dates) {
    const date = new Date(dateStr)
    const diffDays = Math.round((current - date) / (1000 * 60 * 60 * 24))

    if (diffDays === 0 || diffDays === 1) {
      streak++
      current = date
    } else {
      break
    }
  }

  return streak
}

function generateHeatmap(submissions) {
  const countByDate = {}

  for (const s of submissions) {
    const dateStr = s.solvedAt.toISOString().split("T")[0]
    countByDate[dateStr] = (countByDate[dateStr] || 0) + 1
  }

  const result = []
  const today = new Date()

  for (let i = 364; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    const dateStr = date.toISOString().split("T")[0]

    result.push({
      date: dateStr,
      count: countByDate[dateStr] || 0,
    })
  }

  return result
}

function getTagDistribution(submissions) {
  const tagCount = {}

  for (const s of submissions) {
    for (const tag of s.tags) {
      tagCount[tag] = (tagCount[tag] || 0) + 1
    }
  }

  return Object.entries(tagCount)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => a.count - b.count) // weakest first
}

module.exports = { calculateStreak, generateHeatmap, getTagDistribution }