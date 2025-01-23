import React, { useState, useEffect } from "react";
import axiosInsatance from "../utils/axiosInstance";
import { toast } from 'react-toastify';


const GoalAndVisual = ({allTransaction}) => {
    const [budgetgoal, setBudgetgoal] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editData, setEditData] = useState({ name: "", currentAmount: "", targetAmount: "" });
    const [addAmount, setAddAmount] = useState("");
    const [highestSpending, setHighestSpending] = useState({ amount: 0, category: "" });
    const [averageIncome, setAverageIncome] = useState(0);
    const [averageExpense, setAverageExpense] = useState(0);

    const progress = ((budgetgoal[0]?.currentAmount || 0) / (budgetgoal[0]?.targetAmount || 0)) * 100;

    const getBudgetgoal = async () => {
        // get budget goal from database
        try {
            const response = await axiosInsatance.get("/get-budgetgoal");

            if (response.data && response.data.budgetgoal) {
                setBudgetgoal(response.data.budgetgoal);
            }
            } catch (error) {
                console.log("An unexpected error occurred. Please try again.");
            }
        };

    const calculateHighestSpending = () => {
        // find the highest expense of all timeand it category
        if (!allTransaction || allTransaction.length === 0) {
            setHighestSpending({ amount: 0, category: "No Transactions" });
            return;
        }

        const highest = allTransaction.reduce((max, transaction) => {
            if (transaction.type === "expense" && transaction.amount > max.amount) {
                return { amount: transaction.amount, category: transaction.category || "Unknown" };
            }
            return max;
        }, { amount: 0, category: "" });

        setHighestSpending(highest);
    };

    const calculateAverages = () => {
        // Calculate averages Income and Expense for all Transaction
        if (!allTransaction || allTransaction.length === 0) {
            setAverageIncome(0);
            setAverageExpense(0);
            return;
        }
    
        const incomeTransactions = allTransaction.filter(transaction => transaction.type === "income");
        const expenseTransactions = allTransaction.filter(transaction => transaction.type === "expense");
    
        const avgIncome = incomeTransactions.reduce((sum, t) => sum + t.amount, 0) / (incomeTransactions.length || 1);
        const avgExpense = expenseTransactions.reduce((sum, t) => sum + t.amount, 0) / (expenseTransactions.length || 1);
    
        setAverageIncome(avgIncome);
        setAverageExpense(avgExpense);
      };

    const handleEditSavings = async (e) => {
        e.preventDefault();

        const { name, targetAmount, currentAmount } = editData;
        // Making the POST request to edit BudgetGoal
        try {
            const response = await axiosInsatance.post("/edit-budgetgoal", {
                name,
                targetAmount,
                currentAmount,
            });

            if (response.data) {
                console.log('Update BudgetGoal Successfully!:');
                toast.success('Update BudgetGoal Successfully!');
                setShowEditModal(false); 
                getBudgetgoal(); 
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error.response ? error.response.data.message : error.message);
            toast.error("An error occurred. Please try again.");
        }
    };

const handleAddSavings = async (e) => {
    e.preventDefault();
    // Making the POST request to Increase CurrentAmount in BudgetGoal
    try {
        const response = await axiosInsatance.post("/add-budgetgoal", {
            currentAmount: addAmount,
        });
    
        if (response.data) {
            toast.success("Added BudgetGoal Successfully!");
            setShowAddModal(false);
            setAddAmount(""); 
            getBudgetgoal(); 
        }
    } catch (error) {
        console.error(
            "An unexpected error occurred:",
            error.response ? error.response.data.message : error.message
        );
        toast.error("An error occurred. Please try again.");
    }
  };

  useEffect(() => {
    getBudgetgoal();
    calculateHighestSpending();
    calculateAverages();
  }, [allTransaction]);

  return (
    <>
        <div className="flex flex-wrap justify-center mt-6 space-y-4 lg:space-y-0 lg:space-x-6">
            {/* Add & Edit BudgetGoal */}
            <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex-grow">
                <div className="bg-gray-100 p-4">
                    <h2 className="text-xl font-semibold text-black">{budgetgoal[0]?.name || "No Goal Set"}</h2>
                </div>

                {/* progress bar */}
                <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium text-gray-500">
                            Saved: ${budgetgoal[0]?.currentAmount || 0}
                        </span>
                        
                        <span className="text-sm font-medium text-gray-500">
                            Target: ${budgetgoal[0]?.targetAmount || 0}
                        </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div
                            className="bg-green-500 h-2.5 rounded-full"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <p className="text-sm text-gray-500 mt-2">
                        Progress: {progress.toFixed(2)}%
                    </p>
                </div>
                
                {/* button */}
                <div className="p-5 bg-gray-100 text-center flex">
                    <button
                    className="mx-1 w-1/2 bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 focus:outline-none"
                    onClick={() => setShowAddModal(true)}
                    >
                        Add Savings
                    </button>

                    <button
                    className="mx-1 w-1/2 bg-orange-400 text-white py-2 px-4 rounded hover:bg-orange-500 focus:outline-none"
                    onClick={() => {
                        setEditData({
                        name: budgetgoal[0]?.name || "",
                        currentAmount: budgetgoal[0]?.currentAmount || "",
                        targetAmount: budgetgoal[0]?.targetAmount || "",
                        });
                        setShowEditModal(true);
                    }}
                    >
                        Edit Savings
                    </button>
                </div>
            </div>

            {/* Summary */}
            <div className="max-w-sm bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 flex-grow">
                <div className="bg-gray-100 px-2 py-1">
                    <h2 className="text-xl font-semibold text-black">
                        Summary Snapshot
                    </h2>
                    <p className="text-sm text-black mt-1">
                        Up-to-date financial overview
                    </p>
                </div>

                <div className="p-4 space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                            Total transactions Analyzed:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                            {allTransaction?.length || 0} 
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                            Highest Spending:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                            ${highestSpending.amount} ({highestSpending.category})
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                            Remaining Savings Goal:
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                            ${(budgetgoal[0]?.targetAmount || 0) - (budgetgoal[0]?.currentAmount || 0)}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                            Average Income:
                        </span>
                        <span className="text-sm font-medium text-green-600">
                            ${averageIncome.toFixed(2)}
                        </span>
                    </div>
                    
                    <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-500">
                            Average Expense:
                        </span>
                        <span className="text-sm font-medium text-red-600">
                            ${averageExpense.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* Add Savings Modal */}
        {showAddModal && (
            <form onSubmit={handleAddSavings}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded shadow-lg w-96">
                    <h3 className="text-lg font-semibold mb-4">Add Savings</h3>
                    {/* AddAmount Input */}
                    <input
                        type="number"
                        value={addAmount}
                        onChange={(e) => setAddAmount(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Enter Amount"
                    />

                    <div className="flex justify-between mt-4">
                        {/* Cancel Button */}
                        <button
                            className="text-gray-600 hover:text-gray-800"
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </button>
                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
                        >
                            Save
                        </button>
                    </div>
                </div>
                </div>
            </form>
        )}

        {/* Edit Savings Modal */}
        {showEditModal && (
            <form onSubmit={handleEditSavings}>
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h3 className="text-lg font-semibold mb-4">Edit Savings</h3>
                        {/* Name Input */}
                        <input
                            type="text"
                            value={editData.name}
                            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Goal Name"
                        />

                        {/* CurrentAmount Input */}
                        <input
                            type="number"
                            value={editData.currentAmount}
                            onChange={(e) =>
                                setEditData({ ...editData, currentAmount: e.target.value })
                            }
                            className="w-full p-2 border rounded mb-2"
                            placeholder="Current Amount"
                        />

                        {/* TargetAmount Input */}
                        <input
                            type="number"
                            value={editData.targetAmount}
                            onChange={(e) =>
                                setEditData({ ...editData, targetAmount: e.target.value })
                            }
                            className="w-full p-2 border rounded"
                            placeholder="Target Amount"
                        />

                        <div className="flex justify-between mt-4">
                            {/* Cancel Button */}
                            <button
                                className="text-gray-600 hover:text-gray-800"
                                onClick={() => setShowEditModal(false)}
                            >
                                Cancel
                            </button>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        )}
    </>
  );
};

export default GoalAndVisual;
