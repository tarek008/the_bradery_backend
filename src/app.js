// Import packages
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const cors = require("cors");
const bodyParser = require("body-parser");
const usersRouter = require("./routes/users");
const productsRouter = require("./routes/products");
const { pool } = require("./config/database");
const commandesRouter = require("./routes/commands");
const sessionStore = new MySQLStore({}, pool);

// Configure the Express app
const app = express();
app.use(bodyParser.json());
app.set("view engine", "ejs");

// Configure CORS
// Set up CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);

app.use(
  session({
    key: "session_cookie_name",
    secret: "ilovescotchscotchyscotchscotch",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
  })
);
// Routes
app.use("/users", usersRouter);
app.use("/products", productsRouter);
app.use("/commandes", commandesRouter);

// Start the server
const port = 4000;
app.listen(port, () => console.log(`Listening to port ${port}`));
