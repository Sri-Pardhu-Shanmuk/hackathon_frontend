import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

// Reusable component for Sidebar Links
const SidebarItem = ({ label, active, onClick }) => (
    <div onClick={onClick} className={`flex items-center space-x-3 px-4 py-3 rounded-xl cursor-pointer transition-all mb-1 ${active
        ? 'bg-gradient-to-r from-teal-100 to-transparent text-teal-800 font-bold border-l-4 border-teal-500'
        : 'text-gray-500 hover:bg-white hover:shadow-sm'
        }`}>
        <div className={`w-5 h-5 rounded-full ${active ? 'bg-teal-500' : 'bg-gray-300'}`}></div>
        <span>{label}</span>
    </div>
);

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({ full_name: 'Loading...', email: '' });

    // Fetch User Data from Django on Load
    useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
        navigate('/'); 
        return;
    }

    fetch('https://hackathon-backend-j562.onrender.com/api/user/', {
        method: 'GET',
        headers: {
            // CRITICAL: Must be "Bearer [token]"
            'Authorization': `Bearer ${token}`, 
            'Content-Type': 'application/json',
        }
    })
    .then(res => {
        if (res.status === 401) throw new Error("Unauthorized");
        return res.json();
    })
    .then(data => setUser(data))
    .catch(err => {
        console.error(err);
        // If token is bad, clear it and go home
        localStorage.removeItem('token');
        navigate('/');
    });
}, [navigate]);

    // Handle Logout
    const handleLogout = async () => {
        await fetch('https://hackathon-backend-j562.onrender.com/api/logout/', { method: 'POST' });
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="min-h-screen bg-teal-50/30 font-sans flex overflow-hidden text-gray-800">

            {/* Left Sidebar */}
            <aside className="w-64 bg-teal-50/50 border-r border-teal-100 flex flex-col h-screen hidden md:flex">
                <div className="p-6 flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-rose-400 rounded-full flex items-center justify-center text-white font-bold">
                        +
                    </div>
                    <h1 className="text-xl font-bold text-gray-800">Bloodline <span className="text-teal-600">Global</span></h1>
                </div>

                <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                    <SidebarItem label="Home" active={isActive('/dashboard')} onClick={() => navigate('/dashboard')} />
                    <SidebarItem label="Available Blood" active={isActive('/available-blood')} onClick={() => navigate('/available-blood')} />
                    <SidebarItem label="Emergency Hospitals" active={isActive('/emergency-hospitals')} onClick={() => navigate('/emergency-hospitals')} />
                    <SidebarItem label="Want to Donate" active={isActive('/want-to-donate')} onClick={() => navigate('/want-to-donate')} />
                    
                    <div className="my-4 border-t border-gray-200"></div>
                    <SidebarItem label="Donors" active={isActive('/donors')} onClick={() => navigate('/donors')} />
                    <SidebarItem label="Requests" active={isActive('/requests')} onClick={() => navigate('/requests')} />
                    <SidebarItem label="AI Predictions" active={isActive('/ai-predictions')} onClick={() => navigate('/ai-predictions')} />
                    
                    {/* Logout Button in Sidebar */}
                    <div className="pt-4">
                        <button 
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-3 text-rose-500 font-bold hover:bg-rose-50 rounded-xl transition-all"
                        >
                            Logout
                        </button>
                    </div>
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">

                {/* Fixed Top Header */}
                <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10">
                    <div className="flex w-1/3">
                        <input
                            type="text"
                            placeholder="Search locations, blood groups..."
                            className="w-full bg-gray-50 border border-gray-200 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm"
                        />
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="hidden lg:flex items-center space-x-4 text-sm font-medium text-gray-600">
                            <span onClick={() => navigate('/available-blood')} className="hover:text-teal-500 cursor-pointer">Find Blood</span>
                            <span onClick={() => navigate('/want-to-donate')} className="hover:text-teal-500 cursor-pointer">Donate Now</span>
                        </div>
                        
                        {/* Dynamic User Profile */}
                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-800">{user.full_name}</p>
                                <p className="text-xs text-gray-500">Global Network</p>
                            </div>
                            <div className="w-10 h-10 bg-teal-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-teal-700">
                                {user.full_name.charAt(0)}
                            </div>
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
