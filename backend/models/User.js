const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profileImage: { type: String },
  salutation: String,
  firstName: String,
  lastName: String,
  email: String,
  address: String,
  country: String,
  postalCode: String,
  dob: String,
  gender: String,
  maritalStatus: String,
  spouseSalutation: String,
  spouseFirstName: String,
  spouseLastName: String,
  hobbies: String,
  sports: String,
  music: String,
  movies: String
});

module.exports = mongoose.model('User', userSchema);
