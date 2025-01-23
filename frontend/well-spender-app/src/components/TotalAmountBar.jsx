import React from 'react'

const TotalAmountBar = ({totalAmount ,totalIncome, totalExpense }) => {
    
  return (
        <>
            <div className="flex justify-around mt-6 bg-white p-4 rounded-lg shadow-md  w-full mx-auto sm:max-w-3xl sm:px-2">
                <div className="text-center sm:text-sm">
                    <h3 className="text-sm font-semibold text-green-600 sm:text-lg">Total Income</h3>
                    <p className="text-sm font-bold sm:text-lg">${totalIncome.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 sm:text-xs">This Month</p>
                </div>

                <div className="border-l-2 border-gray-300 h-16 mx-4 sm:mx-2"></div>

                <div className="text-sm text-center sm:text-lg">
                    <h3 className="text-sm font-semibold text-black sm:text-lg">Remaining balance</h3>
                    <p className="text-sm font-bold sm:text-lg">${totalAmount.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 sm:text-xs">All time</p>
                </div>

                <div className="border-l-2 border-gray-300 h-16 mx-4 sm:mx-2"></div>

                <div className="text-center sm:text-sm">
                    <h3 className="text-sm font-semibold text-red-600 sm:text-lg">Total Expense</h3>
                    <p className="text-sm font-bold sm:text-lg">${totalExpense.toFixed(2)}</p>
                    <p className="text-sm text-gray-500 sm:text-xs">This Month</p>
                </div>
            </div>
        </>
  )
}

export default TotalAmountBar