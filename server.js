const express = require('express');
const dbConnect = require('./database/index');
const errorHandler = require("./middlewares/errorHandler");
const router=require('./routes/index.js');
const {PORT}=require('./config/index');
const cors = require("cors");
const cookieParser=require('cookie-parser');
// const corsOptions = {
//   credentials: true,
//   origin: ["http://localhost:3000"],
// };
const app = express()

app.use(cookieParser());
// app.use(corsOptions);
app.use(
  cors({
    origin: function (origin, callback) {
      return callback(null, true);
    },
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
// const port = PORT

app.use(express.json());
app.use(router);
dbConnect();
app.use(errorHandler);
app.listen(PORT, () => {
  console.log(`Azeem Estate listening on port ${PORT} and Waris is a good man`)
})