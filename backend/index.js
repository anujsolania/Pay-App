const express = require("express");
const cors = require("cors");
const Router = require("./routes");
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
