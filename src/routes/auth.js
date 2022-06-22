const { PrismaClient } = require("@prisma/client")
const { hash, verify } = require("argon2")
const { upload } = require("../config/multer")
const { auth } = require("../middlewares/auth")

const router = require("express").Router()

const prisma = new PrismaClient()

router.get("/me", auth, async (req, res) => {
  const user = await prisma.users.findUnique({
    where: {
      id: req.session.userId
    },
    select: {
      email: true,
      name:true,
      image: true,
      products: true,
      purchases: true
    }
  })
  if (!user) return res.status(401).json({ msg: "User Not found" })
  res.json({ user })
})

router.post("/login", upload.array("image"), async (req, res) => {
  try {
    const user = await prisma.users.findUnique({
      where: {
        email: req.body.email
      }
    })
    if (!user) return res.status(401).json({ msg: "Bad credentials" })
    const valid = await verify(user.password, req.body.password)
    if (!valid) return res.status(401).json({ msg: "Bad credentials" })
    //session
    req.session.regenerate((err) => {
      if (err) return global.haddleError(err)
      req.session.userId = user.id
      req.session.save((err) => {
        if (err) return global.haddleError(err)
        user.password = undefined // para no enviar la clave de usuario al cliente
        res.json({ msg: "Session started", user })
      })
    })
    //session
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "ups ha ocurrido un error", err: err.message })
  }
})

router.post("/register", upload.array("image"), async (req, res) => {
  try {
    req.body.password = await hash(req.body.password)
    let image = req.body.image = req.files[0].filename
    req.body.image = `http://localhost:3000/images/${image}`
    const user = await prisma.users.create({
      data: req.body,
      select: {
        id: true,
        name: true,
        image: true,
      }
    })
    //session
    req.session.regenerate((err) => {
      if (err) return global.haddleError(err)
      req.session.userId = user.id
      req.session.save((err) => {
        if (err) return global.haddleError(err)
        res.json({ msg: "User created and session started", user })
      })
    })
    //session
  } catch (err) {
    console.log(err)
    res.status(500).json({ msg: "ups ha ocurrido un error", err: err.message })
  }
})

router.delete("/logout", (req, res) => {
  req.session.userId = null
  req.session.save((err) => {

    if (err) return global.haddleError(err)

    req.session.regenerate((err) => {
      if (err) return global.haddleError(err)
      res.json({ msg: "session cerrada con exito" })
    })
  })
})




module.exports = router
