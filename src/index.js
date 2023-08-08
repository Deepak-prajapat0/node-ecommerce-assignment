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
    "mongodb+srv://deepakprajapat:ggev3skeK6tIIJhE@cluster0.7bnz8zu.mongodb.net/angular-ecommerce"
  )
  .then(() => {
    console.log("DB connected");
  })
  .catch((error) => {
    throw new Error(error.message);
  });

let port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});
// 1687525428248