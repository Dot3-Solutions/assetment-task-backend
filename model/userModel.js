const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  DOB: String,
  mobile: Number,
  email: String,
  password: String
});
const user = new mongoose.model('user', userSchema);

module.exports = user;
