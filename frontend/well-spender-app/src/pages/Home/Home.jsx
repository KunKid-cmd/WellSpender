import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axiosInsatance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar";
import TransactionList from "../../components/TransactionList";
import TotalAmountBar from "../../components/TotalAmountBar";
import GoalAndVisual from "../../components/GoalAndVisual";

const Dashboard = () => {
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState(null);
  const [allTransaction, setAllTransaction] = useState([]);
  const [filteredTransaction, setFilteredTransaction] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  // Get user info
  const getUserInfo = async () => {
    try {
      const response = await axiosInsatance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status === 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all transactions
  const getAllTransaction = async () => {
    try {
      const response = await axiosInsatance.get("/get-all-transaction");
      if (response.data && response.data.transactions) {
        setAllTransaction(response.data.transactions);
        setFilteredTransaction(response.data.transactions);
        calculateTotal(response.data.transactions);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Filter transactions for the current month
  const filterCurrentMonthTransactions = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const filtered = allTransaction.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      );
    });
    calculateTotalMonthly(filtered);
  };

  // Calculate total income and expense
  const calculateTotalMonthly = (transactions) => {
    let income = 0;
    let expense = 0;
    transactions.forEach((transaction) => {
      if (transaction.type === "income") {
        income += transaction.amount;
      } else if (transaction.type === "expense") {
        expense += transaction.amount;
      }
    });
    setTotalIncome(income);
    setTotalExpense(expense);
  };

  // Calculate Remaining amount
  const calculateTotal = (transactions) => {
    let total = 0;
    transactions.forEach((transactions) => {
      if (transactions.type === "income") {
        total += transactions.amount;
      } else if (transactions.type === "expense") {
        total -= transactions.amount;
      }
    });
    setTotalAmount(total);
  };

  // Handle search query changes
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (query === "") {
      setFilteredTransaction(allTransaction); 
    } else {
      const filtered = allTransaction.filter((transaction) =>
        transaction.name.toLowerCase().includes(query)
      );
      setFilteredTransaction(filtered); 
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllTransaction();
  }, []);

  useEffect(() => {
    filterCurrentMonthTransactions();
  });

  return (
    <>
      <div className="min-h-screen bg-[#fdf5e6] pb-6">
        {/* alert message */}
        <ToastContainer />
        
        {/* Navbar */}
        <Navbar userInfo={userInfo} fetchAllTransactions={getAllTransaction}/>

        {/* Search Bar */}
        <div className="flex justify-center mt-4">
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={handleSearch}
            className="p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-3/4 max-w-lg text-sm text-gray-700"
          />
        </div>
        {/* Display monthly income, expense and remaining money*/}
        <TotalAmountBar
          totalAmount={totalAmount}
          totalIncome={totalIncome}
          totalExpense={totalExpense}
        />

        {/* Add & edit ExpenseGoal and Summary */}
        <GoalAndVisual  
          allTransaction={allTransaction}
        />

        {/* Transaction List */}
        <TransactionList allTransaction={filteredTransaction} fetchAllTransactions={getAllTransaction} />
      </div>
    </>
  );
};

export default Dashboard;
