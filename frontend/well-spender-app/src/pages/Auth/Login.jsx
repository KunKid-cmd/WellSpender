import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { validateEmail } from '../../utils/helper';
import axiosInsatance from '../../utils/axiosInstance';

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault();

    if(!validateEmail(email)) {
      setError("Please enter a valid email address")
      return;
    }

    if(!password) {
      setError("Please enter the password")
      return;
    }

    setError("");

    // API Call
    try {
      // post to backend
      const response = await axiosInsatance.post("/login", {
        email: email,
        password: password,
      });
      // set token and redirect to dashboard
      if (response.data && response.data.accessToken) {
        localStorage.setItem("token", response.data.accessToken);
        navigate("/dashboard");
      }
    } catch (error){
      if (
        error.response && error.response.data && error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An unexpected error occurred. please try again")
      }
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fdf5e6]">
      {/* Top title */}
      <div className="absolute top-6 left-8">
        <h1 className="text-2xl font-bold text-gray-900">WellSpender</h1>
      </div>

      {/* Login Card */}
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative z-10">
        <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Hey, Enter your details to get sign in to your account.
        </p>
        <form onSubmit={handleLogin}>
          {/* Email/Phone Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm text-gray-700 mb-1">
              Email
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={({target}) => {
                setEmail(target.value);
              }}
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm text-gray-700 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type="password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-400 focus:outline-none"
                placeholder="Enter your password"
                value={password}
                onChange={({target}) => {
                  setPassword(target.value);
                }}
              />
            </div>
          </div>
          
          {error && <p className='text-red-500 text-xs pb-1'>{error}</p>}
          {/* Sign-In Button */}
          <button
            type="submit"
            className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg"
            >
            Sign in
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-300" />
            <span className="px-4 text-sm text-gray-500">Or</span>
            <hr className="flex-grow border-gray-300" />
          </div>


        </form>
          {/* Create new account */}
          <button
              type="submit"
              className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium py-2 px-4 rounded-lg"
              onClick={() => {
                navigate("/signUp");
              }}
              >
              Create new account
          </button>
      </div>
    </div>
  );
};

export default Login;
