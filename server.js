const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");

//dotenv
dotenv.config({ path: "./.env" });

//convert json form
app.use(express.json({ limit: "30mb", extended: true }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

//Cors
app.use(cors({ credentials: true, origin: "*" }));

//Database Connection
require("./Database/conn");

// Setup Port
const port = process.env.PORT || 5000;

//Server
app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
