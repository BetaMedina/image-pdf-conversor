const server = require("./app");

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`App is listening on Port ${PORT}`);
});
