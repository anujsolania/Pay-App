const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Router = require("./routes");
const { Transaction } = require("./db/mongoose");
const app = express();

app.use("/api/v1/payment/webhook", express.raw({ type: "application/json" })); //need raw body to verify the signature

app.use(express.json());
app.use(cors());

app.use("/api/v1", Router);

app.use((err, req, res, next) => {
  return res.json({
    err: err.message,
  });
});

app.listen(3000);

//RECONCILIATION
setInterval(async () => {
  console.log("Running Reconciliation...");

  const allTxns = await Transaction.find({ status: "VERIFYING" });

  for (const txn of allTxns) {
    try {
      const res = await axios.get(
        `https://api.razorpay.com/v1/payments/${txn.paymentId}`,
        {
          auth: {
            username: process.env.RAZORPAY_KEY_ID,
            password: process.env.RAZORPAY_KEY_SECRET,
          },
        }
      );

      console.log("ResOfRzpApi", res);

      const status = res.data.status;

      if (status == "captured") {
        txn.status = "SUCCESS";
        //do DB update of addmoney & transfer
      }

      if (status == "failed") {
        txn.status = "FAILED";
      }

      await txn.save();
    } catch (error) {
      console.error("Reconciliation error", error);
    }
  }
}, 10000);
