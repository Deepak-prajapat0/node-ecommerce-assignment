const express = require("express");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const cors = require('cors')
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {swaggerDefinition} = require('./docs/apiDoc')
const app = express();

require("dotenv").config({ path: "config.env" });

app.use(express.json());
app.use(cors({origin: "*"}));
app.use("/",routes);


const options = {
  swaggerDefinition,
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))



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

module.exports = server