const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const cors = require('cors')
const app = express();

require("dotenv").config({ path: "config.env" });

app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/",routes);





mongoose
  .connect(
    process.env.DB_URL
  )
  .then(() => {
  })
  .catch((error) => {
    throw new Error(error.message);
  });

let port = process.env.PORT || 3001;

let server = app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
// 1687525428248

module.exports = server