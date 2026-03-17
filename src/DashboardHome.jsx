import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, colorClass }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center">
        <h4 className="text-gray-500 text-sm font-medium mb-1">{title}</h4>
        <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
    </div>
);

const DashboardHome = () => {
    const navigate = useNavigate();
    
    // 1. State for our dynamic data
    const [stats, setStats] = useState(null);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);

    // 2. Fetch data from Backend
    useEffect(() => {
        const token = localStorage.getItem('token');

        fetch('http://127.0.0.1:8000/api/dashboard-stats/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to fetch");
            return res.json();
        })
        .then(data => {
            setStats(data.stats);
            setActivities(data.activities);
            setLoading(false);
        })
        .catch(err => {
            console.error("Dashboard Error:", err);
            setLoading(false);
        });
    }, []);

    // 3. Show a loader while the backend responds
    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                <p className="ml-4 text-teal-600 font-medium">Syncing with Global Network...</p>
            </div>
        );
    }

    return (
        <div className="animate-in fade-in duration-500">
            {/* Stats Grid - Using Dynamic Data from Backend */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard 
                    title="Total Registered Donors" 
                    value={stats?.total_donors?.toLocaleString() || "0"} 
                    colorClass="text-teal-600" 
                />
                <StatCard 
                    title="Units This Month" 
                    value={stats?.units_month?.toLocaleString() || "0"} 
                    colorClass="text-emerald-500" 
                />
                <StatCard 
                    title="Active Emergency Requests" 
                    value={stats?.emergency_requests || "0"} 
                    colorClass="text-rose-500" 
                />
                <StatCard 
                    title="Network Hospitals" 
                    value={stats?.hospitals || "0"} 
                    colorClass="text-orange-500" 
                />
                <StatCard 
                    title="Total Available Units" 
                    value={stats?.total_units?.toLocaleString() || "0"} 
                    colorClass="text-teal-600" 
                />
            </div>

            {/* Main Two-Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    {/* Map Placeholder */}
                    <div className="bg-teal-100/50 rounded-3xl h-96 w-full border border-teal-200 relative flex items-center justify-center overflow-hidden shadow-inner">
                        <p className="text-teal-600/50 font-bold text-xl z-10">Global Map Integration</p>
                        <div className="absolute inset-0 opacity-20 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-no-repeat bg-center bg-cover"></div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-wrap gap-4 justify-between">
                        <button onClick={() => navigate('/available-blood')} className="flex-1 py-3 bg-gradient-to-r from-teal-400 to-teal-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                            Search Available Blood
                        </button>
                        <button onClick={() => navigate('/want-to-donate')} className="flex-1 py-3 bg-teal-50 text-teal-700 border border-teal-200 rounded-xl font-bold hover:bg-teal-100 transition-all">
                            Register to Donate
                        </button>
                        <button onClick={() => navigate('/emergency-hospitals')} className="flex-1 py-3 bg-gradient-to-r from-rose-400 to-orange-400 text-white rounded-xl font-bold shadow-md hover:shadow-lg transition-all">
                            Find Nearest ER
                        </button>
                    </div>
                </div>

                {/* Right Column (Live Feed) - Dynamic Activity */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-bold mb-4">Live Activity</h3>
                    <div className="space-y-4">
                        {activities.length > 0 ? (
                            activities.map((act, index) => (
                                <div 
                                    key={index} 
                                    className={`p-3 rounded-lg text-sm ${act.is_emergency ? 'bg-rose-50 text-rose-600 font-medium' : 'bg-teal-50 text-gray-700'}`}
                                >
                                    {act.message}
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400 text-sm">No recent activity.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;