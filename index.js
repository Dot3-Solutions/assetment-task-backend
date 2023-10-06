const express = require('express');
const connect = require('./config/db');
require("dotenv").config();
const userRouter = require("./routes/userRoute.js")
const app = express();
app.use(express.json());

app.use('/api/user/',userRouter)

app.listen(process.env.PORT, () => {
    connect()
    console.log('listening on port ' + process.env.PORT);
})