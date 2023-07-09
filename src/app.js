
const express = require('express');
const http = require("http");
const cors = require("cors");
const morgan = require("morgan");
const { routers } = require('./router');
const errorHandler = require('./modules/errorHandler');

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(errorHandler);
app.use(routers);

app.use((err, req, res, next) => {
  res.status(500).send('Something broke!');
});

const server = http.createServer(app).listen(8000, function () {
  console.log("Sever run port 8000");
});