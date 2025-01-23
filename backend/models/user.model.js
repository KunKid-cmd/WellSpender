const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    // User Model represents an user, containing basic information
    username: {type:String, require: true},
    email: {type: String, require:true, unique: true},
    password: { type: String, require:true},
    createOn: {type: Date, default: Date.now},
});

module.exports = mongoose.model("User", userSchema);