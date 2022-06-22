global.__prod__ = process.env.NODE_ENV == "production"
global.haddleError = (err) => {
  res.json({
    msg: "Ups ha habido un error",
    error: err.message
  })
}
