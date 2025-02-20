const express = require("express");
const cors = require("cors");
//require .env
require("dotenv").config();
//db config
const connectDB = require("./config/db");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");

//init server
const server = express();

//init cors
server.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://hamac-events.com",
        "https://www.hamac-events.com",
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//use json
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// access log
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
server.use(morgan("dev", { stream: logStream }));

//require routes

const routes = require("./routes/index");

server.use(routes);

//run server
connectDB()
  .then((con) => {
    console.log(
      `database connected host:${con.connection.host},dbname:${con.connection.db.databaseName}`
    );

    server.listen(process.env.PORT, () => {
      console.log(
        `express server running on port ${process.env.PORT} in ${server.get(
          "env"
        )}`
      );
    });
  })
  .catch((err) => console.error("failed to connect to database", err));

module.exports = server;
