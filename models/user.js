const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        minlength: 3,
        maxlength: 30,
      },
      given_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
      },
      family_name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 30,
      },
      email: {
        type: String,
        required: true,
        unique: true,
        match: /^\S+@\S+\.\S+$/,
      },
      password: {
        type: String,
        required: true,
        minlength: 6,
      },
      role: {
        type: String,
        required: true,
      },
});

module.exports = mongoose.model('User', userSchema);