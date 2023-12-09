// Run this script to launch the server.
// The server should run on localhost port 8000.
// This is where you should start writing server-side code for this application.
const express = require("express");
const mongoose = require("mongoose");
const routes = require("./src/routes");
const cors = require("cors");
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const MongoStore = require("connect-mongo");
// const MongoDBStore = require('connect-mongodb-session')(session);

const app = express();
app.use(express.json());

// var store = new MongoDBStore({
//   uri: 'mongodb://127.0.0.1:27017/fake_so',
//   collection: 'sessions'
// });

// app.use(session({
//   secret: '98gdec23rdfwlsmjd4g43tazwdosr345',
//   resave: false,
//   saveUninitialized: false,
//   store: store,
//   cookie: {
//     httpOnly: true,
//     secure: false, // Set to true if using HTTPS
//   }
// }));
app.use(
  cors({
    origin: ["http://localhost:3000"], // your client's origin
    methods: ["POST", "GET", "PUT"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: "98gdec23rdfwlsmjd4g43tazwdosr345",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: "mongodb://127.0.0.1:27017/fake_so", // Replace with your MongoDB URL
      collectionName: "sessions", // Optional, 'sessions' by default
    }),
    cookie: {
      expires: 24 * 3600,
    },
  })
);

app.use("/api", routes);

mongoose
  .connect("mongodb://127.0.0.1:27017/fake_so", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected...");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use((req, res) => {
  res.status(404).send("Sorry, that route does not exist.");
});

const server = app.listen(8000, () => {
  console.log("Server is running on port 8000");
});

const gracefulShutdown = () => {
  server.close(() => {
    console.log("Server closed. Shutting down database connection...");
    mongoose.connection
      .close()
      .then(() => {
        console.log("Database instance disconnected");
        process.exit(0);
      })
      .catch((err) => {
        console.error("Error during database disconnection:", err);
        process.exit(1);
      });
  });
};

process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);
