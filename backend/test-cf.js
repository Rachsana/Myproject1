const axios = require("axios")
const lcService = require("./services/lcService")

async function testLC() {
  console.log("Testing LC stats...")
  const stats = await lcService.getSolvedStats("neal_wu")
  console.log("LC stats:", stats)
}

testLC() 

async function test() {
  try {
    const res = await axios.get("https://codeforces.com/api/user.info?handles=tourist", {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
      }
    })
    console.log("Status:", res.data.status)
    console.log("Rating:", res.data.result[0].rating)
  } catch (err) {
    console.log("Error:", err.message)
  }
}

test()