const bcrypt= require("bcrypt")
const jwt=require("jsonwebtoken")
const {z, email} = require("zod")
const prisma=require("../utils/prismaClient")

const registerSchema= z.object({
    email: z.string().email("Invalid email"),
    password:z.string().min(6,"Password should be atleast 6 char long"),
    username:z.string().min(3,"Password should be atleast 6 char long")
})

const loginSchema=z.object({
    email: z.string().email("Invalid email"),
    password:z.string().min(1,"Password required")
})

function createToken(userId){
    return jwt.sign({userId},process.env.JWT_SECRET, {expiresIn:"7d"})
}

async function register(req,res,next) {
    try{
        const {email, password, username}= registerSchema.parse(req.body)

        const existing =await prisma.user.findFirst({
            where:{ OR: [{email},{username}]},
        })
        if(existing){
            return res.status(400).json({error: "email or username already taken"})
        }
        const hashedpassword=await bcrypt.hash(password,10)
        const user=await prisma.user.create({
            data:{email,password:hashedpassword, username},
        })
        const token=createToken(user.id)
        res.status(201).json({token,username:user.username})
    }catch(err){
        next(err)
    }
}

async function login(req,res,next){
    try{
        const {email, password}= loginSchema.parse(req.body)

        const user= await prisma.user.findUnique({ where: {email}})
        if(!user || !user.password){
            return res.status(401).json({ error: "invalid credentials"})
        }

        const isValid=await bcrypt.compare(password, user.password)
        if(!isValid){
            return res.status(401).json({error : "invalid credentials"})
        }
         const token = createToken(user.id)
    res.json({ token, username: user.username })
    }catch(err){
        next(err)
    }
}

module.exports = { register, login }