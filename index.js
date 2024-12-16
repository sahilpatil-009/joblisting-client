const express = require("express");
const app = express();
const dotenv = require("dotenv");
const connectToDB = require("./dbConnect/dbConnect.js");
const userRouter = require("./routes/user.js");
const jobRouter = require("./routes/jobs.js");
const cors = require("cors");

dotenv.config({})
const port = process.env.PORT || 3000;
connectToDB();
app.use(cors());

app.use(express.json());
app.use("/user", userRouter);
app.use("/job", jobRouter);

app.listen(port, ()=>{
    console.log(`app listen on port ${port}`);
});