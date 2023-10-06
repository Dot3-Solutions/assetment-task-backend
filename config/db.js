const mongoose = require("mongoose");

let connect = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://P4rth:Helloworld2019@migration.gi385.mongodb.net/CRUD"
    );
  } catch (error) {
    console.log(error);
  }
};

module.exports = connect;
