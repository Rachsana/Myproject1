const express = require("express")
const router = express.Router()
const statsController = require("../controllers/statsController")
const authMiddleware = require("../middleware/authMiddleware")

router.use(authMiddleware)

router.get("/overview", statsController.getOverview)
router.get("/heatmap", statsController.getHeatmap)
router.get("/tags", statsController.getTags)
router.get("/rating", statsController.getRating)
router.get("/recent", statsController.getRecent)

module.exports = router