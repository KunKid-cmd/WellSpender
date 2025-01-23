import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const TransactionList = ({ allTransaction, fetchAllTransactions }) => {
  // Transaction list and page selection
  const [currentPage, setCurrentPage] = useState(1);

  const changePage = (page) => {
    setCurrentPage(page);
  };

  // set limit showing transaction per page
  const itemsPerPage = 10;

  const totalPages = Math.ceil(allTransaction.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const currentTransactions = allTransaction.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Delete transaction
  const deleteTransaction = async (transactionId) => {
    try {
      const response = await axiosInstance.delete(`/delete-transaction/${transactionId}`);
      if (response.data && !response.data.error) {
        toast.success("Transaction deleted successfully");
        await fetchAllTransactions();
      }
    } catch (error) {
      console.error("An unexpected error occurred while deleting the transaction:", error);
      toast.error("Failed to delete the transaction. Please try again.");
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded-lg mt-6">
      <h2 className="text-lg font-semibold text-gray-700">Transactions</h2>
      <ul className="mt-4">
        {allTransaction.length > 0 ? (
          <div>
            {currentTransactions.map((item) => (
              <li
                key={item._id}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-lg mb-2 shadow-sm"
              >
                <div>
                  <p className="text-sm font-medium text-gray-800">{item.name}</p>
                  <p className="text-xs text-gray-500">
                    {item.category} | {new Date(item.date).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.description}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p
                    className={`text-sm font-bold ${
                      item.type === 'income' ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {item.type === 'income' ? '+' : '-'}${item.amount}
                  </p>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => deleteTransaction(item._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </div>
        ) : (
          <>Empty</>
        )}
      </ul>

      {/* change pages button */}
      <div className="flex justify-between items-center mt-4">
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-400 text-white hover:bg-orange-500'
          }`}
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <p className="text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          className={`px-4 py-2 rounded-lg shadow ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-orange-400 text-white hover:bg-orange-500'
          }`}
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default TransactionList;
