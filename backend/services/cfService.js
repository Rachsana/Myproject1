const axios= require("axios")
const CF_BASE = "https://codeforces.com/api"

async function validateHandle(handle){
    try{
        const res= await axios.get(`${CF_BASE}/user.info?handles=${handle}`)
        return res.data.status ==="OK"
    }catch{
        return false
    }
}

async function getSubmissions(handle) {
  const res = await axios.get(
    `${CF_BASE}/user.status?handle=${handle}&from=1&count=1000`
  )

  if (res.data.status !== "OK") {
    throw new Error(`CF API error for handle: ${handle}`)
  }

  return res.data.result.map((s) => ({
    platform: "codeforces",
    problemId: `${s.problem.contestId}${s.problem.index}`,
    problemName: s.problem.name,
    verdict: normalizeVerdict(s.verdict),
    tags: s.problem.tags || [],
    difficulty: s.problem.rating ? String(s.problem.rating) : null,
    solvedAt: new Date(s.creationTimeSeconds * 1000),
  }))
}

async function getRatingHistory(handle) {
  const res = await axios.get(`${CF_BASE}/user.rating?handle=${handle}`)

  if (res.data.status !== "OK") return []

  return res.data.result.map((r) => ({
    contestName: r.contestName,
    date: new Date(r.ratingUpdateTimeSeconds * 1000),
    oldRating: r.oldRating,
    newRating: r.newRating,
    rank: r.rank,
  }))
}

async function getCurrentRating(handle) {
  try {
    const res = await axios.get(`${CF_BASE}/user.info?handles=${handle}`)
    if (res.data.status === "OK") {
      return res.data.result[0].rating || null
    }
    return null
  } catch {
    return null
  }
}

function normalizeVerdict(verdict) {
  const map = {
    OK: "AC",
    WRONG_ANSWER: "WA",
    TIME_LIMIT_EXCEEDED: "TLE",
    MEMORY_LIMIT_EXCEEDED: "MLE",
    COMPILATION_ERROR: "CE",
    RUNTIME_ERROR: "RE",
  }
  return map[verdict] || verdict
}

module.exports = { validateHandle, getSubmissions, getRatingHistory, getCurrentRating }