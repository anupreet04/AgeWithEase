const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    name: String,
    age: Number,
    blood: String,
    condition: String,
    contact: String
});

module.exports = mongoose.model("Profile", profileSchema);