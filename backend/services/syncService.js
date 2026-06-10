const cron = require("node-cron")
const prisma = require("../utils/prismaClient")
const redis = require("../utils/redisClient")
const cfService = require("./cfService")
const lcService = require("./lcService")

async function syncUser(userId) {
  const profiles = await prisma.platformProfile.findMany({
    where: { userId },
  })

  if (profiles.length === 0) return

  for (const profile of profiles) {
    try {
      let submissions = []

      if (profile.platform === "codeforces") {
        submissions = await cfService.getSubmissions(profile.handle)

        const rating = await cfService.getCurrentRating(profile.handle)
        if (rating) {
          await prisma.platformProfile.update({
            where: { id: profile.id },
            data: { rating, lastSynced: new Date() },
          })
        }
      }

      if (profile.platform === "leetcode") {
        submissions = await lcService.getSubmissions(profile.handle)
        await prisma.platformProfile.update({
          where: { id: profile.id },
          data: { lastSynced: new Date() },
        })
      }

      for (const sub of submissions) {
        await prisma.submission.upsert({
          where: {
            userId_platform_problemId_solvedAt: {
              userId,
              platform: sub.platform,
              problemId: sub.problemId,
              solvedAt: sub.solvedAt,
            },
          },
          update: {},
          create: { userId, ...sub },
        })
      }

      await redis.del(`stats:overview:${userId}`)
      await redis.del(`stats:heatmap:${userId}`)
      await redis.del(`stats:tags:${userId}`)
      await redis.del(`stats:rating:${userId}`)

      console.log(`Synced ${profile.platform} for user ${userId}`)
    } catch (err) {
      console.error(`Sync failed for ${profile.platform}:`, err.message)
    }
  }
}

async function syncAllUsers() {
  console.log("Starting full sync...")

  const users = await prisma.user.findMany({
    where: { platformProfiles: { some: {} } },
    select: { id: true },
  })

  for (const user of users) {
    await syncUser(user.id)
  }

  console.log(`Sync done for ${users.length} users`)
}

function startSyncService() {
  cron.schedule("0 */6 * * *", () => {
    syncAllUsers()
  })
  console.log("Sync service started - runs every 6 hours")
}

module.exports = { syncUser, startSyncService }