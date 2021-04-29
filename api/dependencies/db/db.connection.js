const mongoose = require("mongoose");
const {logSuccess, logError, logInfo} = require("../helpers/console.helpers");

// Connecting to our Mongodb Databse
mongoose
  .connect(`${process.env.MONGODB_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    
  })
  .then((result) => {
    logSuccess("Connection Established To ABC-Supply Cluster");
  })
  .catch((error) => {
    logError(error.message);
    process.exit(0);
  });


// Listening to Node Event once mongoose connection establishes
mongoose.connection.on("connected", async () => {
  logSuccess("Connected to ABC-WaterSupply Database");
});


// Listening to Node Error Event if mongoose connection fails
mongoose.connection.on("error", (error) => {
  logError(error.message);
    // Exit process with failure Code:1. "1" is failure code, while "0" is normal exit code
      process.exit(0);
});


// Close connection to the Database on node process exit
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  logInfo("Closing DB Connection on Process Shut down.")
   // Exit process with failure Code:1. "1" is failure code, while "0" is normal exit code
   process.exit(0);
});

//https://nodejs.dev/learn/how-to-exit-from-a-nodejs-program
