const prisma = require("../utils/prismaClient")
const redis = require("../utils/redisClient")
const statsEngine = require("../services/statsEngine")

async function withCache(key, ttlSeconds, fn) {
  const cached = await redis.get(key)
  if (cached) {
    return JSON.parse(cached)
  }
  const data = await fn()
  await redis.set(key, JSON.stringify(data), "EX", ttlSeconds)
  return data
}
async function getOverview(req, res, next) {
  try {
    const userId = req.userId

    const data = await withCache(`stats:overview:${userId}`, 3600, async () => {
      const submissions = await prisma.submission.findMany({
        where: { userId },
      })

      const totalSolved = submissions.filter((s) => s.verdict === "AC").length
      const cfSolved = submissions.filter(
        (s) => s.platform === "codeforces" && s.verdict === "AC"
      ).length
      const lcSolved = submissions.filter(
        (s) => s.platform === "leetcode" && s.verdict === "AC"
      ).length
      const streak = statsEngine.calculateStreak(
        submissions.filter((s) => s.verdict === "AC")
      )

      const profiles = await prisma.platformProfile.findMany({
        where: { userId },
      })
      const cfProfile = profiles.find((p) => p.platform === "codeforces")

      return {
        totalSolved,
        cfSolved,
        lcSolved,
        streak,
        cfRating: cfProfile?.rating || null,
        lastSynced: cfProfile?.lastSynced || null,
      }
    })

    res.json(data)
  } catch (err) {
    next(err)
  }
}
async function getHeatmap(req, res, next) {
  try {
    const userId = req.userId

    const data = await withCache(`stats:heatmap:${userId}`, 3600, async () => {
      const submissions = await prisma.submission.findMany({
        where: { userId, verdict: "AC" },
        select: { solvedAt: true },
        orderBy: { solvedAt: "asc" },
      })

      return statsEngine.generateHeatmap(submissions)
    })

    res.json(data)
  } catch (err) {
    next(err)
  }
}
async function getTags(req, res, next) {
  try {
    const userId = req.userId

    const data = await withCache(`stats:tags:${userId}`, 3600, async () => {
      const submissions = await prisma.submission.findMany({
        where: { userId, verdict: "AC" },
        select: { tags: true },
      })

      return statsEngine.getTagDistribution(submissions)
    })

    res.json(data)
  } catch (err) {
    next(err)
  }
}
async function getRating(req, res, next) {
  try {
    const userId = req.userId

    const data = await withCache(`stats:rating:${userId}`, 3600, async () => {
      const profile = await prisma.platformProfile.findFirst({
        where: { userId, platform: "codeforces" },
      })

      if (!profile) return []

      const cfService = require("../services/cfService")
      return await cfService.getRatingHistory(profile.handle)
    })

    res.json(data)
  } catch (err) {
    next(err)
  }
}
async function getRecent(req, res, next) {
  try {
    const userId = req.userId

    const submissions = await prisma.submission.findMany({
      where: { userId, verdict: "AC" },
      orderBy: { solvedAt: "desc" },
      take: 20,
      select: {
        platform: true,
        problemName: true,
        difficulty: true,
        solvedAt: true,
        tags: true,
      },
    })

    res.json(submissions)
  } catch (err) {
    next(err)
  }
}
async function getPublicProfile(req, res, next) {
  try {
    const { username } = req.params

    const user = await prisma.user.findUnique({
      where: { username },
      include: { platformProfiles: true },
    })

    if (!user) {
      return res.status(404).json({ error: "User not found" })
    }

    const submissions = await prisma.submission.findMany({
      where: { userId: user.id, verdict: "AC" },
    })

    res.json({
      username: user.username,
      platforms: user.platformProfiles.map((p) => ({
        platform: p.platform,
        handle: p.handle,
        rating: p.rating,
      })),
      totalSolved: submissions.length,
      streak: statsEngine.calculateStreak(submissions),
      heatmap: statsEngine.generateHeatmap(submissions),
    })
  } catch (err) {
    next(err)
  }
}
module.exports = { getOverview, getHeatmap, getTags, getRating, getRecent, getPublicProfile }