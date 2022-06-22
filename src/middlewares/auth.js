
exports.auth = (req, res, next) => {
  if (req.session.userId) {
    next()
    return
  }
  res.status(401).json({ msg: "Debes iniciar session" })
}
