const mongoose = require("mongoose");
const {logSuccess, logError} = require("../helpers/console.helpers");

// Connecting to our Mongodb Databse
mongoose
  .connect(`${process.env.MONGODB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: true,
  })
  .then((result) => {
    logSuccess("Connection Established To ABC-Supply Cluster");
  })
  .catch((error) => {
      logError(error.message);
  });


// Listening to Node Event once mongoose connection establishes
mongoose.connection.on("connected", async () => {
  logSuccess("Connected to ABC-WaterSupply Database");
});


// Listening to Node Error Event if mongoose connection fails
mongoose.connection.on("error", (error) => {
  logError(error.message);
});


// Close connection to the Database on node process exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
});

//https://nodejs.dev/learn/how-to-exit-from-a-nodejs-program
