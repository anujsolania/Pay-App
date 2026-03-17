const mongoose = require("mongoose");

require("dotenv").config();
mongoose
  .connect(`${process.env.MONGO_URL}`)
  .then(() => {
    console.log("connected to mongoDB");
  })
  .catch((error) => {
    console.error("connection error", error);
  });

const userSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
  balance: { type: Number, required: true },
});

const transactionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    orderId: { type: String, required: true },
    amount: { type: Number, required: true },
    // date: { type: Date, default: Date.now },
    type: { type: String, enum: ["TRANSFER", "ADD_MONEY"], required: true },
    status: {
      type: String,
      enum: ["PENDING", "VERIFYING", "SUCCESS", "EXPIRED", "FAILED"],
      required: true,
    },
    rzpPaymentId: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("user", userSchema);
const Account = mongoose.model("account", accountSchema);
const Transaction = mongoose.model("transaction", transactionSchema);

module.exports = { User, Account, Transaction };
