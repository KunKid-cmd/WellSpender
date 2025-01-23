const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const budgetGoalSchema = new Schema({
    // BudgetGoal model represents a financial goal for a user.
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    targetAmount: { type: Number, required: true ,default: 0},
    currentAmount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("BudgetGoal", budgetGoalSchema);
