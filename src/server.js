const http = require("http");
const app = require("./app");
const { logInfo } = require("../api/dependencies/helpers/console.helpers");


// Use the Port from Env variable or 7000 if it's not present
const PORT = process.env.PORT || 7000;

//Create the Standard Node Server with express app as request handler
const server = http.createServer(app);



server.listen(PORT, () => {
  logInfo(
    `Server Up and Running on ${PORT} : Environment ${process.env.APP_NODE.toUpperCase()}`
  );
});
