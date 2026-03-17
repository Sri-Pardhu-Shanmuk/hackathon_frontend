import React, { useState, useEffect } from 'react';

const RequestCard = ({ reqId, bloodGroup, units, urgency, status, matchedDonors, date, onUpdate }) => {
    const isUrgent = urgency === 'SOS' || urgency === 'High';

    return (
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between transition-all hover:shadow-md mb-4 group">
            <div className="flex items-start space-x-4 w-full md:w-auto mb-4 md:mb-0">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-xl shadow-sm border transition-transform group-hover:scale-105 ${
                    isUrgent ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-teal-50 text-teal-600 border-teal-100'
                }`}>
                    {bloodGroup}
                </div>
                <div>
                    <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-bold text-gray-800 text-lg">Request {reqId}</h4>
                        <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md ${
                            urgency === 'SOS' ? 'bg-rose-600 text-white animate-pulse' :
                            urgency === 'High' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                            {urgency}
                        </span>
                    </div>
                    <p className="text-xs text-gray-500 font-medium italic">
                        {units} Units Needed • <span className="text-gray-400">{date}</span>
                    </p>
                </div>
            </div>

            <div className="w-full md:w-1/3 px-0 md:px-8 mb-4 md:mb-0 border-l-0 md:border-l border-gray-100">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">AI Matching Hub</p>
                <div className="flex items-center space-x-2">
                    <div className="flex -space-x-2">
                        {matchedDonors > 0 ? (
                            [...Array(Math.min(matchedDonors, 3))].map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-tr from-teal-400 to-teal-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold z-10 shadow-sm">✓</div>
                            ))
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center">
                                <div className="w-1 h-1 bg-gray-400 rounded-full animate-ping"></div>
                            </div>
                        )}
                    </div>
                    <span className={`text-xs font-bold ml-2 ${matchedDonors > 0 ? 'text-teal-600' : 'text-gray-400'}`}>
                        {matchedDonors > 0 ? `${matchedDonors} Donors Found` : 'Scanning Network...'}
                    </span>
                </div>
            </div>

            <div className="flex flex-col items-end w-full md:w-auto">
                <div className="flex items-center space-x-2 mb-3">
                    <div className={`w-2 h-2 rounded-full ${status === 'Fulfilled' ? 'bg-emerald-500' : 'bg-orange-400'}`}></div>
                    <span className="text-xs font-bold text-gray-600 uppercase tracking-tighter">{status}</span>
                </div>
                <button 
                    onClick={() => onUpdate(reqId)}
                    className={`w-full md:w-auto px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                        status === 'Fulfilled' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-800 hover:bg-gray-900 hover:text-white shadow-sm'
                    }`} 
                    disabled={status === 'Fulfilled'}
                >
                    {status === 'Fulfilled' ? 'Archived' : 'Fulfill Request'}
                </button>
            </div>
        </div>
    );
};

const Requests = () => {
    const [filter, setFilter] = useState('Active');
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        bloodGroup: 'O+',
        units: 1,
        urgency: 'Normal'
    });

    const fetchRequests = async () => {
        setLoading(true);
        setError(null);
        try {
            // CRITICAL: Match the key used in Login.jsx ('token')
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError("Authentication missing. Please log in.");
                return;
            }

            const response = await fetch(`https://hackathon-backend-j562.onrender.com/api/blood-requests/?filter=${filter}`, {
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 401) {
                setError("Session expired. Please re-login.");
                return;
            }

            const data = await response.json();
            setRequests(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Error fetching requests:", error);
            setError("Failed to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, [filter]);

    const handleCreateRequest = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('https://hackathon-backend-j562.onrender.com/api/create-request/', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                setIsModalOpen(false);
                setFormData({ bloodGroup: 'O+', units: 1, urgency: 'Normal' }); // Reset form
                fetchRequests();
            } else {
                alert("Failed to create request. Please check inputs.");
            }
        } catch (error) {
            console.error("Error creating request:", error);
        }
    };

    // Placeholder for fulfillment logic (Update Status)
    const handleFulfillRequest = async (reqId) => {
        alert(`Functionality to fulfill ${reqId} is ready for backend integration.`);
        // You would call an endpoint here like /api/fulfill-request/${reqId}/
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-[#fcfcfc]">
            <div className="max-w-5xl mx-auto flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Request Hub</h2>
                    <p className="text-sm text-gray-500">Track real-time blood requirements</p>
                </div>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-teal-600 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-teal-700 transition-all transform active:scale-95"
                >
                    + Create New Request
                </button>
            </div>

            <div className="max-w-5xl mx-auto">
                {error && (
                    <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-2xl text-sm font-bold flex justify-between items-center">
                        <span>{error}</span>
                        <button onClick={() => window.location.reload()} className="underline">Retry</button>
                    </div>
                )}

                <div className="flex p-1.5 bg-gray-100 rounded-2xl w-fit mb-8">
                    {['Active', 'Fulfilled'].map((type) => (
                        <button key={type} onClick={() => setFilter(type)}
                            className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${
                                filter === type ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}>
                            {type} {filter === type && !loading && `(${requests.length})`}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-20">
                            <div className="inline-block w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                            <p className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Synchronizing with Blood Grid...</p>
                        </div>
                    ) : requests.length > 0 ? (
                        requests.map((req) => (
                            <RequestCard 
                                key={req.reqId} 
                                {...req} 
                                onUpdate={handleFulfillRequest} 
                            />
                        ))
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No {filter.toLowerCase()} requests found.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* CREATE REQUEST MODAL */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in fade-in zoom-in duration-300">
                        <div className="mb-8">
                            <h3 className="text-2xl font-black text-gray-800">New Request</h3>
                            <p className="text-gray-400 text-sm font-medium">Broadcast to nearby donors</p>
                        </div>
                        
                        <form onSubmit={handleCreateRequest} className="space-y-6">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Target Blood Group</label>
                                <select 
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold text-gray-700 focus:ring-2 focus:ring-teal-500 outline-none transition-all"
                                    value={formData.bloodGroup}
                                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                                >
                                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>
                            
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Units</label>
                                    <input 
                                        type="number" min="1" 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                        value={formData.units}
                                        onChange={(e) => setFormData({...formData, units: e.target.value})}
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2 block">Urgency</label>
                                    <select 
                                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl font-bold outline-none focus:ring-2 focus:ring-teal-500 transition-all"
                                        value={formData.urgency}
                                        onChange={(e) => setFormData({...formData, urgency: e.target.value})}
                                    >
                                        <option value="Normal">Normal</option>
                                        <option value="High">High</option>
                                        <option value="SOS">SOS</option>
                                    </select>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-6">
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-4 text-gray-400 font-bold hover:text-gray-600 transition-all"
                                >
                                    Dismiss
                                </button>
                                <button 
                                    type="submit" 
                                    className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-black transition-all transform active:scale-95"
                                >
                                    Broadcast
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Requests;