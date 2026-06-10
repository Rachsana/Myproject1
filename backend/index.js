const express=require("express")
const cors=require("cors")
const helmet=require("helmet")
const rateLimit=require("express-rate-limit")
const dotenv=require("dotenv")
const prisma=require("./utils/prismaClient")
const authRoutes = require("./routes/auth")
const statsRoutes = require("./routes/stats")
const userRoutes = require("./routes/user")
const { startSyncService } = require("./services/syncService")

dotenv.config()

const app=express()
const PORT = process.env.PORT || 3000

app.use(helmet())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials:true,
}))
app.use(express.json())

prisma.$connect().then(()=> console.log("Databas Connected"))
.catch((err)=> console.error("Database connection failed:",err.message))

const limiter = rateLimit({
    windowMs: 15*60* 1000,
    max: 100,
    message: {error: "Too many requests, slow down"},
})
app.use(limiter)

app.get("/",(req,res)=>{
    res.json({
        message:"Hey Rachna :) track ur progress  ",
        status:"ok",
        timestamp: new Date().toISOString()
    })
})

app.use("/auth", authRoutes)
app.use("/stats", statsRoutes)
app.use("/user", userRoutes)

const statsController = require("./controllers/statsController")
app.get("/u/:username", statsController.getPublicProfile)


app.use((err,req,res,next)=>{
    console.error("Error:",err.message);
    res.status(err.status || 500).json({ error: err.message || "Internal server error"})
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
  startSyncService()
})