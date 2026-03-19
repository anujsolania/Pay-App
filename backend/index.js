const express = require("express");
const cors = require("cors");
const axios = require("axios");
const Router = require("./routes");
const { Transaction, Account } = require("./db/mongoose");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(
  "/api/v1/account/payment/webhook",
  express.raw({ type: "application/json" })
); //need raw body to verify the signature

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
        `https://api.razorpay.com/v1/payments/${txn.rzpPaymentId}`,
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
        // txn.status = "SUCCESS";
        if (txn.type == "ADD_MONEY") {
          await Account.updateOne(
            { userId: txn.userId },
            { $inc: { balance: txn.amount } }
          );
        }

        if (txn.type == "TRANSFER") {
          const session = await mongoose.startSession();
          session.startTransaction();

          try {
            await Account.updateOne(
              { userId: txn.userId },
              { $inc: { balance: -txn.amount } }
            ).session(session);

            await Account.updateOne(
              { userId: txn.receiverId },
              { $inc: { balance: txn.amount } }
            ).session(session);

            await session.commitTransaction();
            await session.endSession();
          } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            console.error(error);
            return res
              .status(500)
              .send("error while money transfer via reconciliation");
          }
        }

        await Transaction.updateOne(
          { orderId: txn.orderId },
          { status: "SUCCESS" }
        );
      }

      if (status == "failed") {
        await Transaction.updateOne(
          { orderId: txn.orderId },
          { status: "FAILED" }
        );
      }
    } catch (error) {
      console.error("Reconciliation error", error);
    }
  }
}, 5000);
