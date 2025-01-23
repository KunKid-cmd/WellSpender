import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddNewTransaction from './AddNewTransaction';

const Navbar = ({userInfo, fetchAllTransactions}) => {

    const navigate = useNavigate();

    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const onLogout = () => {
        localStorage.clear();
        navigate("/login");
    }

    return (
        <div>
            {/* Navbar */}
            <nav className="flex justify-between items-center bg-white p-4 shadow rounded-lg mb-6">
                {/* Left side */}
                {/* Application Name */}
                <div className="text-xl font-bold text-gray-700">
                    WellSpender
                </div>

                {/* Right side */}
                <div className="flex items-center space-x-6">
                    {/* Add Transaction Button */}
                    <AddNewTransaction  fetchAllTransactions={fetchAllTransactions}/>

                    {/* Username and Logout */}
                    <div className="relative">
                        <button
                            className="text-gray-700"
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                        >
                            {userInfo ? userInfo.username:""}
                        </button>
                        
                        {isUserMenuOpen && (
                            <div className="absolute right-0 mt-2 bg-white p-2 rounded-lg shadow-lg">
                                <button
                                    className="text-red-500 hover:text-red-700"
                                    onClick={onLogout}
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    )
}

export default Navbar