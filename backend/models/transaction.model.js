const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    // Transaction Model represents an Transaction of an user, containing detailed transaction.
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    description: { type: String },
    amount: { type: Number, required: true },
    type: { 
        type: String, 
        enum: ["income", "expense"], 
        required: true 
    },
    category: { 
        type: String, 
        enum: ["Food", "Rent", "Salary", "Utilities", "Shopping", "Health", "Transportation"],
        required: true 
    },
    date:  { type: Date, default: Date.now() },
});

module.exports = mongoose.model("Transaction", transactionSchema);
