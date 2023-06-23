const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const app = express();

require("dotenv").config({ path: "config.env" });

app.use(express.json());
app.use("/",routes);

mongoose
  .connect(process.env.DB_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    throw new Error(error.message);
  });

let port = process.env.PORT;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
// 1687525428248