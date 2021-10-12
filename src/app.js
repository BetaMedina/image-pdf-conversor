const express = require("express");
const app = express();
const routes = require("./routes/generate.routes");
app.use(express.json());
app.use(express.static("public"));

routes(app);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

module.exports = app;
