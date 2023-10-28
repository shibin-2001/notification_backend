const mongoose = require("mongoose");

const connectDB = () => {
    console.log(process.env.MONGODB_URL)
  mongoose.connect(process.env.MONGODB_URL , {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB");
  });
};

const disconnectDB = () => {
  mongoose.disconnect(() => {
    console.log("Disconnected from MongoDB");
  });
};
module.exports = { connectDB, disconnectDB };
