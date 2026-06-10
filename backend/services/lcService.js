const axios = require("axios")

const LC_BASE = "https://alfa-leetcode-api.onrender.com"
async function getSolvedStats(username) {
  const res = await axios.get(`${LC_BASE}/${username}/solved`)
  return {
    easySolved: res.data.easySolved,
    mediumSolved: res.data.mediumSolved,
    hardSolved: res.data.hardSolved,
    totalSolved: res.data.solvedProblem,
  }
}
async function getSubmissions(username) {
  const res = await axios.get(`${LC_BASE}/${username}/submission`)

  if (!res.data.submission) return []

  // normalize to same shape as CF submissions
  return res.data.submission.map((s) => ({
    platform: "leetcode",
    problemId: s.titleSlug,
    problemName: s.title,
    verdict: s.statusDisplay === "Accepted" ? "AC" : "WA",
    tags: [],
    difficulty: s.difficulty || null,
    solvedAt: new Date(s.timestamp * 1000),
  }))
}
module.exports = { getSolvedStats, getSubmissions }