const crypto = require("crypto");

const verifyWebhookSignature = (req) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

  const expectedSign = crypto
    .createHmac("sha256", secret)
    .update(req.body)
    .digest("hex");

  const receivedSign = req.headers["x-razorpay-signature"];

  return expectedSign == receivedSign;
};

module.exports = verifyWebhookSignature;
