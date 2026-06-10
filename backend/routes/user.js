const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/authMiddleware")
const prisma = require("../utils/prismaClient")
const { syncUser } = require("../services/syncService")
const { z } = require("zod")

router.use(authMiddleware)

// link a platform handle
router.post("/profile", async (req, res, next) => {
  try {
    const schema = z.object({
  platform: z.string().refine((val) => ["codeforces", "leetcode"].includes(val), {
    message: "platform must be codeforces or leetcode",
  }),
  handle: z.string().min(1),
})

    const { platform, handle } = schema.parse(req.body)

    const profile = await prisma.platformProfile.upsert({
      where: {
        userId_platform: {
          userId: req.userId,
          platform,
        },
      },
      update: { handle },
      create: { userId: req.userId, platform, handle },
    })

    syncUser(req.userId).catch(console.error)

    res.json({ message: "Profile linked, sync started", profile })
  } catch (err) {
    next(err)
  }
})

router.post("/sync", async (req, res, next) => {
  try {
    // fire and forget — don't await
    syncUser(req.userId).catch(console.error)
    res.json({ message: "Sync started" })
  } catch (err) {
    next(err)
  }
})

module.exports = router