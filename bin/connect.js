const mongoose = require("mongoose");
require("dotenv").config();

const mongoUri = process.env.MONGODB_URI;


async function connect() {
  try {
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
  }
}

module.exports = connect;