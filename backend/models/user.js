const mongoose = require('mongoose');
const {Schema, model} = mongoose;


// Define a schema for the "users" collection
const userSchema = new mongoose.Schema({
    username: {type: String, require: true, min: 4, unique: true},
    password: {type: String, require: true},
});

// Create a Mongoose model for the "users" collection
const User = mongoose.model('User', userSchema);

module.exports = User; // Export the User model