const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
//require .env
require("dotenv").config();
//db config
const connectDB = require("./config/db");
const morgan = require("morgan");
const fs = require("fs");
const path = require("path");
const { UPLOAD_DIR } = require("./middlewares/ImageUpload");

//init server
const server = express();

// Origines autorisées : CORS_ORIGINS (séparées par des virgules) ou valeurs par défaut
const allowedOrigins = (
  process.env.CORS_ORIGINS ||
  "http://localhost:3000,http://localhost:5173,https://hamac-events.com,https://www.hamac-events.com"
)
  .split(",")
  .map((o) => o.trim());

//init cors
server.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

//use json
server.use(express.json({ limit: "2mb" }));
server.use(express.urlencoded({ extended: true }));
server.use(cookieParser());

// access log
const logStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a",
});
server.use(morgan("dev", { stream: logStream }));

// images stockées en local (mode UPLOAD_DRIVER=local)
server.use("/uploads", express.static(UPLOAD_DIR, { maxAge: "30d" }));

server.get("/health", (req, res) => res.json({ ok: true }));

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
