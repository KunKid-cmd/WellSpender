import React, { useState } from 'react';
import axiosInsatance from '../utils/axiosInstance';
import { toast } from 'react-toastify';

const AddNewTransaction = ({fetchAllTransactions}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTransaction, setNewTransaction] = useState({
        name: '',
        description: '',
        amount: '',
        type: 'expense',
        category: 'Food',
    });

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewTransaction((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const { name, description, amount, type, category} = newTransaction;
    
        try {
            // Making the POST request to add transaction
            const response = await axiosInsatance.post("/add-transaction", {
                name,
                description,
                amount,
                type,
                category,
            });
    
            if (response.data && response.data.transactionList) {
                // Handle success
                console.log('Transaction added successfully:', response.data.transactionList);
                toast.success('Transaction added successfully!');
                closeModal();
                await fetchAllTransactions();
            }
    
        } catch (error) {
            console.error("An unexpected error occurred:", error.response ? error.response.data.message : error.message);
            toast.error("An error occurred. Please try again.");
        }
    };

    return (
        <div>
            <button
                onClick={openModal}
                className="bg-orange-400 text-white px-2 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow hover:bg-orange-500"
            >
                <p className='text-sm'>Add Transaction</p>
            </button>


            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Add New Transaction</h2>
                        
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <label className="text-sm font-medium text-gray-600" htmlFor="name">Transaction Name</label>
                                <input 
                                    type="text" 
                                    id="name"
                                    name="name"
                                    value={newTransaction.name}
                                    onChange={handleInputChange}
                                    placeholder="Transaction Name" 
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>

                            {/* Description Input */}
                            <div>
                                <label className="text-sm font-medium text-gray-600" htmlFor="description">Description</label>
                                <input 
                                    type="text" 
                                    id="description"
                                    name="description"
                                    value={newTransaction.description}
                                    onChange={handleInputChange}
                                    placeholder="Optional Description"
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                />
                            </div>

                            {/* Amount Input */}
                            <div>
                                <label className="text-sm font-medium text-gray-600" htmlFor="amount">Amount</label>
                                <input 
                                    type="number" 
                                    id="amount"
                                    name="amount"
                                    value={newTransaction.amount}
                                    onChange={handleInputChange}
                                    placeholder="Amount" 
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                />
                            </div>

                            {/* Type Input */}
                            <div>
                                <label className="text-sm font-medium text-gray-600" htmlFor="type">Type</label>
                                <select 
                                    id="type"
                                    name="type"
                                    value={newTransaction.type}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>

                            {/* Category Input */}
                            <div>
                                <label className="text-sm font-medium text-gray-600" htmlFor="category">Category</label>
                                <select 
                                    id="category"
                                    name="category"
                                    value={newTransaction.category}
                                    onChange={handleInputChange}
                                    className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
                                    required
                                >
                                    {["Food", "Rent", "Salary", "Utilities", "Shopping", "Health", "Transportation"].map((cat) => (
                                          <option key={cat} value={cat}>{cat}</option>
                                      ))}
                                </select>
                            </div>

                            <div className="flex justify-between mt-4">
                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="bg-orange-400 text-white px-6 py-2 rounded-lg hover:bg-orange-500"
                                >
                                    Submit
                                </button>

                                {/* Cancel Button */}
                                <button 
                                    type="button"
                                    onClick={closeModal}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddNewTransaction;
