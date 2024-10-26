const mongoose = require('mongoose');
const express = require('express');
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const postRoute = require('./routes/post');

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

  //ROUTE
  app.use("/v1/auth", authRoute);
  app.use("/v1/user", userRoute);
  app.use('/v1/posts', postRoute);
  
  app.listen(8000, () => {
    console.log("Server is running")
  });

   