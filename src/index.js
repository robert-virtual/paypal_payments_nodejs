const express = require("express")
const session = require("express-session")
const cors = require("cors")
const app = express()
if (!global.__prod__) {
  require("dotenv").config()
  app.set("trust proxy", 1)
}
const port = process.env.PORT || 3000

// middlewares
app.use(cors({
  credentials: true,
  origin: "http://localhost:3001",
}))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
// sessiones
app.use(session({
  name: "qid",
  secret: process.env.SESSIONS_SECRET,
  saveUninitialized: false,
  resave: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 365 * 10, // 10 years
    httpOnly: true,
    sameSite: "lax",
    secure: global.__prod__,
  }
}))


//static files
app.use(express.static("public"))

//routes
app.use("/", require("./routes/payments"))
app.use("/", require("./routes/auth"))

app.listen(port, () => {
  console.log(`server(${global.__prod__ ? "prod" : "dev"}) running on port ${port}...`)
})

