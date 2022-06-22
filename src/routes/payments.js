const router = require("express").Router()
const paypal = require("../config/paypal")


router.post("/checkout", (req, res) => {
  paypal.payment.create(createPaymentJson, (err) => {
    if (err) {
      res.status(500)
        .json({
          msg: "Ups hubo un error al relaizar el pago. " + err.message
        })
      return
    }
    res.json({ msg: "payment recieved" })
  })
})



module.exports = router
