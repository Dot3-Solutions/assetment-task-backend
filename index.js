const express = require("express");
const connect = require("./config/db");
require("dotenv").config();
const cors = require("cors");
const userRouter = require("./routes/userRoute.js");
const app = express();
app.use(express.json());

app.use(cors());
app.use("/api/user/", userRouter);

app.listen(process.env.PORT, () => {
  connect();
});
