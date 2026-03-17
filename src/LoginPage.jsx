import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [activeTab, setActiveTab] = useState('signin');
    const nav = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Extract values from the form
        const form = e.target;
        let fullName, email, password;

        if (activeTab === 'signup') {
            fullName = form.elements[0].value;
            email = form.elements[1].value;
            password = form.elements[2].value;
        } else {
            email = form.elements[0].value;
            password = form.elements[1].value;
        }

        // 2. Define Endpoints
        const url = activeTab === 'signin' 
            ? 'https://hackathon-backend-j562.onrender.com/api/login/' 
            : 'https://hackathon-backend-j562.onrender.com/api/register/';

        const bodyData = activeTab === 'signin' 
            ? { username: email, password: password }
            : { username: email, email: email, password: password, full_name: fullName };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bodyData)
            });

            const result = await response.json();

            if (response.ok) {
                if (activeTab === 'signin') {
                    // --- JWT IMPLEMENTATION ---
                    // Store the access token and name for the Dashboard to use
                    localStorage.setItem('token', result.access); 
                    localStorage.setItem('userName', result.full_name);
                    nav('/dashboard');
                } else {
                    alert("Account created! Please sign in.");
                    setActiveTab('signin');
                }
            } else {
                alert("Error: " + (result.error || "Authentication failed"));
            }
        } catch (error) {
            console.error("Connection failed:", error);
            alert("Could not connect to the backend server.");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-rose-50 flex items-center justify-center p-6 font-sans">
            <div className="bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row w-full max-w-5xl overflow-hidden border border-gray-100">

                {/* Left Side - Branding */}
                <div className="w-full md:w-1/2 bg-teal-50/50 p-10 flex flex-col justify-center items-center text-center border-r border-teal-100/50">
                    <div className="mb-8 flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold text-xl">+</div>
                        <h1 className="text-2xl font-bold text-gray-800">Bloodline Global</h1>
                    </div>
                    <img src="https://cdn-icons-png.flaticon.com/512/2966/2966327.png" alt="Branding" className="w-48 h-48 mb-8 opacity-80" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Saving Lives, Connecting the World.</h2>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-1/2 p-10 lg:p-16">
                    <div className="flex bg-gray-100 rounded-full p-1 mb-8">
                        <button onClick={() => setActiveTab('signin')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'signin' ? 'bg-gradient-to-r from-teal-400 to-rose-400 text-white shadow-md' : 'text-gray-500'}`}>Sign In</button>
                        <button onClick={() => setActiveTab('signup')} className={`flex-1 py-2 rounded-full text-sm font-semibold transition-all ${activeTab === 'signup' ? 'bg-gradient-to-r from-teal-400 to-rose-400 text-white shadow-md' : 'text-gray-500'}`}>Sign Up</button>
                    </div>

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {activeTab === 'signup' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input type="text" placeholder="John Doe" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none" />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email / ID</label>
                            <input type="text" placeholder="Enter your ID or Email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                            <input type="password" placeholder="••••••••" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-teal-400 outline-none" />
                        </div>

                        <button type="submit" className="w-full py-3 mt-4 bg-gradient-to-r from-teal-400 to-rose-400 text-white rounded-xl font-bold text-lg shadow-lg hover:opacity-90 transition-all">
                            {activeTab === 'signin' ? 'Sign In' : 'Create Account'}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
                            <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-400">Or continue with</span></div>
                        </div>

                        {/* Google Button Centered */}
                        <div className="flex justify-center">
                            <button type="button" className="w-full max-w-xs py-2 border border-gray-200 rounded-xl flex items-center justify-center text-gray-700 font-medium hover:bg-gray-50 transition-all">
                                <img src="https://www.gstatic.com/images/branding/product/1x/googleg_48dp.png" alt="Google" className="w-5 h-5 mr-2" />
                                Google
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;