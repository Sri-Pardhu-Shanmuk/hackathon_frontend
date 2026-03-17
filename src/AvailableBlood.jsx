import React, { useState, useEffect } from 'react';

// Reusable Card for Blood Search Results
const ResultCard = ({ nodeName, distance, availableUnits, component }) => (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-between transition-all hover:shadow-md animate-in fade-in slide-in-from-bottom-2">
        <div className="flex items-start space-x-4 mb-4">
            <div className="w-20 h-20 bg-teal-50 rounded-xl border border-teal-100 flex items-center justify-center relative overflow-hidden flex-shrink-0">
                <div className="w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center absolute shadow-md z-10">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <span className="text-[10px] text-teal-600 font-bold absolute bottom-2">LOC-ID</span>
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-gray-800 text-lg truncate">{nodeName}</h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                    <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Distance</p>
                        <p className="font-semibold text-gray-700">{distance}</p>
                    </div>
                    <div>
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Available</p>
                        <p className="font-semibold text-teal-600">{availableUnits} Units</p>
                    </div>
                    <div className="col-span-2">
                        <p className="text-gray-400 text-[10px] uppercase font-bold tracking-tight">Component</p>
                        <p className="font-semibold text-gray-700">{component}</p>
                    </div>
                </div>
            </div>
        </div>
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <span className="bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1 rounded-full flex items-center">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-2 animate-pulse"></span> AI Verified
            </span>
            <button className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-95">
                Request
            </button>
        </div>
    </div>
);

const AvailableBlood = () => {
    const [bloodGroup, setBloodGroup] = useState('B+');
    const [component, setComponent] = useState('Whole Blood');
    const [results, setResults] = useState([]);
    const [topDonors, setTopDonors] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        // encodeURIComponent handles characters like '+' in 'B+'
        const queryParams = `group=${encodeURIComponent(bloodGroup)}&component=${encodeURIComponent(component)}`;
        const url = `https://hackathon-backend-j562.onrender.com/api/search-blood/?${queryParams}`;

        try {
            const response = await fetch(url, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) throw new Error("Search request failed");
            
            const data = await response.json();
            
            // Sync both results and donors from backend
            setResults(data.results || []);
            setTopDonors(data.top_donors || []);
            
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    // This ensures data refreshes whenever you change the search criteria
    useEffect(() => { 
        fetchData(); 
    }, [bloodGroup, component]);

    return (
        <div className="p-4 md:p-8 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-extrabold text-gray-800 mb-8 flex items-center">
                    <span className="w-2 h-8 bg-rose-500 rounded-full mr-4"></span>
                    Find Available Blood
                </h2>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Search & Results */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-6 text-sm uppercase tracking-widest">Search Parameters</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase">Blood Group</label>
                                    <select 
                                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-teal-500" 
                                        value={bloodGroup} 
                                        onChange={(e) => setBloodGroup(e.target.value)}
                                    >
                                        {['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase">Component</label>
                                    <select 
                                        className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold text-gray-700 outline-none transition-all focus:ring-2 focus:ring-teal-500"
                                        value={component} 
                                        onChange={(e) => setComponent(e.target.value)}
                                    >
                                        {['Whole Blood', 'Platelets', 'Plasma'].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase">Max Radius</label>
                                    <select className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold text-gray-700">
                                        <option>10 km</option><option>25 km</option><option>50 km</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase">Location</label>
                                    <button className="w-full bg-teal-50 text-teal-700 border border-teal-200 px-4 py-3 rounded-xl text-xs font-black hover:bg-teal-100 transition-all">
                                        USE GPS
                                    </button>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    onClick={fetchData} 
                                    disabled={loading} 
                                    className="bg-gray-900 text-white px-10 py-3 rounded-2xl text-xs font-bold shadow-lg hover:bg-black transition-all disabled:opacity-50 active:scale-95"
                                >
                                    {loading ? 'SEARCHING...' : 'SEARCH NOW'}
                                </button>
                            </div>
                        </div>

                        {/* Search Results List */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-6 flex items-center text-sm uppercase tracking-widest">
                                Available Results
                                <span className="ml-3 text-[10px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-bold uppercase">Live Stock</span>
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {results.length > 0 ? (
                                    results.map((res, i) => <ResultCard key={i} {...res} />)
                                ) : (
                                    <div className="col-span-2 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl py-16 text-center">
                                        <p className="text-gray-400 font-medium italic">No active units found for {bloodGroup}.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Sidebar: AI & Top Donors */}
                    <div className="space-y-8">
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
                            <h3 className="font-bold text-gray-800 mb-6 border-b border-gray-50 pb-4 text-sm uppercase tracking-widest">AI Insights</h3>
                            
                            {/* Prediction Card */}
                            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl p-5 mb-8 text-white relative overflow-hidden shadow-lg shadow-teal-500/20">
                                <div className="relative z-10">
                                    <p className="text-teal-100 font-bold mb-1 text-[10px] uppercase tracking-tighter">Local Demand Spike</p>
                                    <p className="text-xl font-black">+12.4%</p>
                                    <p className="text-[10px] text-teal-50 opacity-80 mt-2 leading-relaxed">Demand for {bloodGroup} is predicted to increase in this node. Alerting nearby matches.</p>
                                </div>
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-8 -mt-8"></div>
                            </div>

                            {/* Donors List Section */}
                            <div>
                                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">Verified Donors Nearby</h4>
                                <div className="space-y-4">
                                    {topDonors.length > 0 ? (
                                        topDonors.map((donor, i) => (
                                            <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-2xl border border-transparent hover:border-gray-100 transition-all cursor-pointer group">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 bg-gray-100 group-hover:bg-teal-100 rounded-full flex items-center justify-center text-gray-600 group-hover:text-teal-700 font-black text-xs transition-colors shadow-sm">
                                                        {donor.name.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-gray-800">{donor.name}</p>
                                                        <p className="text-[10px] text-gray-400">Reliability Score</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <span className="text-[10px] font-black bg-teal-50 text-teal-700 px-2 py-1 rounded-lg border border-teal-100">
                                                        {donor.score}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                            <p className="text-[10px] text-gray-400 font-bold uppercase">No donors in range</p>
                                        </div>
                                    )}
                                </div>
                                <button className="w-full mt-6 py-3 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-bold text-gray-400 hover:border-teal-200 hover:text-teal-500 transition-all uppercase">
                                    Refresh Directory
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvailableBlood;