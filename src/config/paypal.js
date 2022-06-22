const paypal = require("paypal-rest-sdk")
paypal.configure({
  mode:"sandbox",
  client_id:process.env.PAYPAL_CLIENT_SECRET,
  client_secret:process.env.PAYPAL_CLIENT_ID
})

module.exports = paypal

