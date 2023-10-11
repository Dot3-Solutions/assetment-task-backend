const mongoose = require("mongoose");

let connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://P4rth:Helloworld2019@migration.gi385.mongodb.net/CRUD"
    );
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Couldn't connect to database",
    });
  }
};

module.exports = connect;
