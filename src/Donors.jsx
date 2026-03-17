import React, { useState, useEffect } from 'react';

// Keep your DonorRow exactly as it is (it's great!)
const DonorRow = ({ name, bloodGroup, location, lastDonation, reliabilityScore, status }) => (
    <tr className="border-b border-gray-100 hover:bg-teal-50/30 transition-all group">
        <td className="py-4 px-6 flex items-center space-x-3 w-[250px]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-50 to-teal-100 flex items-center justify-center text-teal-700 font-bold text-sm shadow-sm border border-white group-hover:scale-110 transition-transform flex-shrink-0">
                {name.charAt(0)}
            </div>
            <div className="truncate">
                <p className="font-bold text-gray-800 text-sm truncate">{name}</p>
                <p className="text-[10px] text-gray-400 font-mono tracking-tighter">ID: #NETWORK-ID</p>
            </div>
        </td>
        <td className="py-4 px-4 w-[100px]">
            <span className="bg-rose-50 text-rose-600 font-bold px-3 py-1 rounded-lg border border-rose-100 text-xs">{bloodGroup}</span>
        </td>
        <td className="py-4 px-4 text-xs text-gray-600 font-medium w-[200px]">{location}</td>
        <td className="py-4 px-4 text-xs text-gray-500 w-[150px]">{lastDonation}</td>
        <td className="py-4 px-4 w-[110px]">
            <div className="flex items-center space-x-2">
                <span className={`font-mono font-bold text-xs ${reliabilityScore >= 0.9 ? 'text-teal-600' : 'text-orange-500'}`}>
                    {(reliabilityScore * 100).toFixed(0)}%
                </span>
                {reliabilityScore >= 0.9 && (
                    <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse"></div>
                )}
            </div>
        </td>
        <td className="py-4 px-4 w-[140px]">
            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider whitespace-nowrap ${status === 'Eligible' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-400'}`}>
                {status}
            </span>
        </td>
        <td className="py-4 px-6 text-right flex-1">
            <button
                className="text-teal-600 hover:text-white font-bold text-xs bg-white border border-teal-100 hover:bg-teal-600 px-4 py-2 rounded-xl shadow-sm transition-all disabled:opacity-30"
                disabled={status !== 'Eligible'}
            >
                Ping
            </button>
        </td>
    </tr>
);

const Donors = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [donorsData, setDonorsData] = useState([]); // 1. Start with an empty array
    const [loading, setLoading] = useState(true);

    // 2. Fetch from Django on load
    useEffect(() => {
        const token = localStorage.getItem('token');
        fetch('http://127.0.0.1:8000/api/donors/', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.json())
        .then(data => {
            setDonorsData(data);
            setLoading(false);
        })
        .catch(err => {
            console.error("Error fetching donors:", err);
            setLoading(false);
        });
    }, []);

    // 3. Keep your Filter Logic exactly the same
    const filteredDonors = donorsData.filter(donor =>
        donor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
        donor.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-teal-600 animate-pulse font-bold">Accessing Secure Donor Registry...</div>;

    return (
        <div className="flex-1 overflow-hidden flex flex-col p-4 md:p-8 animate-in fade-in duration-500">
            {/* ... Rest of your JSX code remains EXACTLY the same ... */}
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 flex-shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">Donor Directory</h2>
                    <p className="text-sm text-gray-500">Real-time network donor registry</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="text-right hidden sm:block mr-4">
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Network Load</p>
                        <p className="text-sm font-bold text-teal-600">{filteredDonors.length} Matches Found</p>
                    </div>
                    <button className="bg-white text-gray-700 border border-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all flex items-center shadow-sm">
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col min-h-0">
                <div className="bg-white p-3 rounded-3xl shadow-sm border border-gray-100 mb-6 flex-shrink-0">
                    <div className="relative">
                        <svg className="w-4 h-4 text-gray-400 absolute left-4 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <input
                            type="text"
                            placeholder="Search by name, node, or blood group..."
                            className="w-full pl-11 pr-4 py-3 bg-gray-50/50 border-none rounded-2xl focus:ring-2 focus:ring-teal-400/20 text-sm transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 flex flex-col flex-1 min-h-0 overflow-hidden">
                    <div className="overflow-x-auto flex-shrink-0 border-b border-gray-100 bg-gray-50/50">
                        <table className="w-full text-left table-fixed">
                            <thead>
                                <tr>
                                    <th className="py-5 px-6 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[250px]">Donor Details</th>
                                    <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[100px]">Group</th>
                                    <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[200px]">Node</th>
                                    <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[150px]">Last Donation</th>
                                    <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[110px]">Reliability</th>
                                    <th className="py-5 px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest w-[140px]">Status</th>
                                    <th className="py-5 px-6 text-right text-[10px] font-black text-gray-400 uppercase tracking-widest flex-1">Action</th>
                                </tr>
                            </thead>
                        </table>
                    </div>

                    <div className="overflow-y-auto overflow-x-auto flex-1 custom-scrollbar">
                        <table className="w-full text-left table-fixed">
                            <tbody className="divide-y divide-gray-50">
                                {filteredDonors.length > 0 ? (
                                    filteredDonors.map((donor, index) => (
                                        <DonorRow key={index} {...donor} />
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center text-gray-400 text-sm italic">
                                            No donors found matching "{searchTerm}"
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Donors;