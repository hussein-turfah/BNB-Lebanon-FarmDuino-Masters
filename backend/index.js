require("dotenv").config();
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const http = require("http");
const initializeSocketIO = require("./socket");
const routes = require("./routes/index");
const mongoose = require("./config/mongoose");
const app = express();
app.use(express.json());

const server = http.createServer(app);
initializeSocketIO(server);


app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
    },
  })
);
mongoose.connect();


app.use(
  cors({
    origin: "http://localhost:3001",
    methods: "GET, POST, PUT, DELETE",
    credentials: true,
  })
);


app.use("/v1", routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
