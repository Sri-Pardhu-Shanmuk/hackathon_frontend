import React, { useState, useEffect } from 'react';

const EmergencyHospitals = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [nodes, setNodes] = useState([]);
    const [aiDonors, setAiDonors] = useState([]);
    const [forecast, setForecast] = useState('Analyzing live data...');
    const [loading, setLoading] = useState(false);

    // 1. Fetch Emergency Nodes & AI Insights
    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`http://127.0.0.1:8000/api/emergency-nodes/?q=${searchQuery}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setNodes(data.nodes || []);
            setAiDonors(data.ai_donors || []);
            setForecast(data.forecast);
        } catch (error) {
            console.error("Error fetching emergency data:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Broadcast SOS
    const handleSOS = async () => {
        const token = localStorage.getItem('token');
        if (!window.confirm("Broadcast SOS to all nearby verified donors?")) return;

        try {
            const response = await fetch('http://127.0.0.1:8000/api/broadcast-sos/', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                alert("Emergency Broadcast Sent Successfully!");
            }
        } catch (error) {
            alert("Failed to send SOS. Check connection.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="flex h-[calc(100vh-80px)] overflow-hidden animate-in fade-in duration-500">

            {/* Left Side: Full Screen Map Interface */}
            <div className="flex-1 relative bg-teal-50/50 rounded-l-3xl overflow-hidden border border-gray-100">
                <div className="absolute inset-0 bg-[url('https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg')] bg-cover bg-center opacity-30"></div>

                <div className="absolute inset-0 z-10 p-8 flex flex-col items-center pointer-events-none">
                    {/* Floating Search Bar */}
                    <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-gray-100 w-full max-w-2xl pointer-events-auto mt-4">
                        <div className="flex items-center space-x-2 mb-3">
                            <div className="flex-1 relative">
                                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input
                                    type="text"
                                    placeholder="FIND NEAREST NOW (e.g., Node 012)"
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-400 font-bold text-gray-700"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <button 
                                onClick={fetchData}
                                className="bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-bold shadow-md transition-all">
                                {loading ? '...' : 'Search'}
                            </button>
                        </div>
                    </div>

                    {/* Static User Location */}
                    <div className="absolute top-1/3 left-1/4 bg-white px-3 py-2 rounded-xl shadow-lg border border-teal-100 flex items-center space-x-2 pointer-events-auto">
                        <div className="w-3 h-3 bg-teal-500 rounded-full animate-ping absolute"></div>
                        <div className="w-3 h-3 bg-teal-500 rounded-full relative"></div>
                        <span className="text-xs font-bold text-gray-800">You</span>
                    </div>

                    {/* Dynamic Hospital Nodes from Backend */}
                    {nodes.map((node, idx) => (
                        <div 
                            key={node.id}
                            className="absolute bg-white px-3 py-2 rounded-xl shadow-lg border border-rose-100 flex items-center space-x-2 pointer-events-auto cursor-pointer hover:scale-105 transition-transform"
                            style={{ top: `${40 + (idx * 10)}%`, left: `${40 + (idx * 5)}%` }} // Visual offset for demo
                        >
                            <div className="w-3 h-3 bg-rose-500 rounded-full"></div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-gray-800">{node.id} | {node.name}</span>
                                <span className="text-[10px] text-gray-500">{node.trauma ? 'Trauma Unit' : 'General'}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right Panel: SOS Actions */}
            <div className="w-80 bg-white border-l border-gray-100 flex flex-col h-full shadow-xl">
                <div className="p-6 overflow-y-auto flex-1">
                    <div className="mb-8">
                        <button 
                            onClick={handleSOS}
                            className="w-full bg-gradient-to-r from-rose-500 to-rose-600 text-white font-bold text-lg py-4 rounded-xl shadow-lg shadow-rose-200 hover:shadow-xl hover:opacity-90 transition-all flex items-center justify-center">
                            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
                            </svg>
                            Broadcast SOS
                        </button>
                        <p className="text-xs text-center text-gray-500 mt-3">Pings nearest ML-verified donors.</p>
                    </div>

                    <h3 className="font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">AI SOS Insights</h3>

                    <div className="bg-rose-50 rounded-xl p-4 mb-6 border border-rose-100 flex flex-col items-center justify-center">
                        <p className="text-rose-600 font-bold text-sm mb-1">Urgent Forecast</p>
                        <p className="text-xs text-gray-500 text-center">{forecast}</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Verified Reliable Donors</h4>
                        <div className="space-y-3">
                            {aiDonors.map((donor, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg transition-all border border-gray-100">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center text-teal-700 font-bold text-xs">
                                            {donor.name.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-gray-800">{donor.name}</span>
                                            <span className="text-[10px] text-gray-500">Reliability Rank</span>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-teal-600">{donor.score}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmergencyHospitals;