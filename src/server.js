const http = require("http");
const app = require("./app");
const { logInfo } = require("../api/dependencies/helpers/console.helpers");
//Create the Standard Node Server with
//express app as request handler
const PORT = process.env.PORT || 7000;
const server = http.createServer(app);
server.listen(PORT, () => {
  logInfo(
    `Server Up and Running on ${PORT} : Environment ${process.env.APP_NODE.toUpperCase()}`
  );
});
