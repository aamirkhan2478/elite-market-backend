const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const { notFound, errorHandler } = require("./Middleware/errors");

//dotenv
dotenv.config({ path: "./.env" });

//convert json form
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//Cors
app.use(cors({ credentials: true, origin: "*" }));

//Database Connection
require("./Database/conn");

//Routes
app.use("/api/user", require("./Routes/userRoutes"));
app.use(notFound);
app.use(errorHandler);

// Setup Port
const port = process.env.PORT || 5000;

//Server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
