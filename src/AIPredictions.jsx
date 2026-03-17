import React, { useState } from 'react';

const AIPredictions = () => {
    const [isRunning, setIsRunning] = useState(false);

    const handleRunModel = () => {
        setIsRunning(true);
        setTimeout(() => setIsRunning(false), 2000); // Simulating model execution
    };

    return (
        <div className="flex-1 flex flex-col h-screen overflow-hidden animate-in fade-in duration-700">

            {/* Top Header */}
            <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-8 z-10">
                <div>
                    <h2 className="text-xl font-bold text-gray-800">Hema-Predict AI Engine</h2>
                    <p className="text-xs text-gray-500 font-medium">Model Monitoring & Evaluation</p>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="flex items-center text-[10px] font-black uppercase tracking-widest text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full border border-teal-100 shadow-sm">
                        <span className="w-2 h-2 bg-teal-500 rounded-full mr-2 animate-ping"></span>
                        Engine Online
                    </span>
                </div>
            </header>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 bg-teal-50/20">
                <div className="max-w-7xl mx-auto space-y-8">

                    {/* Top Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[
                            { label: 'Overall Accuracy', value: '94.2%', color: 'teal', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { label: 'Data Points Processed', value: '1.2M', color: 'indigo', icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4' },
                            { label: 'Last Re-Training', value: '02:00 AM', color: 'rose', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' }
                        ].map((stat, i) => (
                            <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex items-center justify-between group hover:border-teal-200 transition-all">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-800">{stat.value}</p>
                                </div>
                                <div className={`w-12 h-12 bg-${stat.color}-50 rounded-2xl flex items-center justify-center text-${stat.color}-500 group-hover:scale-110 transition-transform`}>
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon}></path>
                                    </svg>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                        {/* LSTM Demand Forecasting Panel */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                                <div>
                                    <h3 className="font-bold text-gray-800 text-lg">LSTM Demand Forecasting</h3>
                                    <p className="text-xs text-gray-500 font-medium">Time-Series Deep Learning</p>
                                </div>
                                <button
                                    onClick={handleRunModel}
                                    className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isRunning
                                            ? 'bg-gray-100 text-gray-400 cursor-wait'
                                            : 'bg-teal-600 text-white hover:bg-teal-700 shadow-md shadow-teal-100'
                                        }`}
                                >
                                    {isRunning ? 'Analyzing...' : 'Run Forecast'}
                                </button>
                            </div>
                            <div className="p-8">
                                <div className="h-64 bg-gray-50 border border-gray-100 rounded-3xl flex items-center justify-center relative overflow-hidden shadow-inner">
                                    <svg className="w-full h-full text-teal-100 opacity-40" preserveAspectRatio="none" viewBox="0 0 100 100">
                                        <path d="M0 100 Q 20 80, 40 90 T 80 60 T 100 80 L 100 100 Z" fill="currentColor"></path>
                                        <path d="M0 100 Q 20 60, 40 70 T 80 40 T 100 50" fill="none" stroke="#0d9488" strokeWidth="2.5"></path>
                                        <path d="M0 100 Q 20 90, 40 80 T 80 90 T 100 60" fill="none" stroke="#f43f5e" strokeWidth="2" strokeDasharray="4"></path>
                                    </svg>
                                    <div className="absolute top-6 left-6 flex space-x-6 text-[10px] font-black uppercase tracking-widest bg-white/90 px-4 py-2 rounded-xl backdrop-blur-md shadow-sm border border-gray-100">
                                        <span className="flex items-center text-teal-700"><div className="w-2.5 h-2.5 bg-teal-500 rounded-full mr-2"></div> Actual</span>
                                        <span className="flex items-center text-rose-500"><div className="w-2.5 h-2.5 bg-rose-400 rounded-full mr-2 border-2 border-dashed border-rose-500"></div> Predicted</span>
                                    </div>
                                </div>

                                <div className="mt-8 grid grid-cols-2 gap-4">
                                    <div className="bg-teal-50/50 p-5 rounded-2xl border border-teal-100">
                                        <p className="text-[10px] text-teal-700 font-black uppercase tracking-widest mb-1">RMSE Score</p>
                                        <p className="text-2xl font-black text-teal-900">12.4</p>
                                    </div>
                                    <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                                        <p className="text-[10px] text-indigo-700 font-black uppercase tracking-widest mb-1">Lookback</p>
                                        <p className="text-2xl font-black text-indigo-900">30 Days</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Random Forest Donor Reliability Panel */}
                        <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="font-bold text-gray-800 text-lg">RF Reliability Classification</h3>
                                <p className="text-xs text-gray-500 font-medium">Donor Reliability Scoring</p>
                            </div>
                            <div className="p-8">
                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-6">Feature Importance Analysis</h4>
                                <div className="space-y-6 mb-10">
                                    {[
                                        { label: 'Response Time', val: 45 },
                                        { label: 'Donation Frequency', val: 30 },
                                        { label: 'Proximity to ER', val: 15 }
                                    ].map((f, i) => (
                                        <div key={i}>
                                            <div className="flex justify-between text-xs mb-2 font-bold text-gray-700 uppercase tracking-tighter">
                                                <span>{f.label}</span>
                                                <span className="text-teal-600">{f.val}%</span>
                                            </div>
                                            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                                                <div
                                                    className="bg-gradient-to-r from-teal-400 to-teal-600 h-full rounded-full transition-all duration-1000"
                                                    style={{ width: isRunning ? '0%' : `${f.val}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Live Confidence Scores</h4>
                                <div className="overflow-hidden rounded-2xl border border-gray-100">
                                    <table className="w-full text-left text-xs">
                                        <thead>
                                            <tr className="bg-gray-50 text-gray-500 uppercase font-black">
                                                <th className="px-4 py-3">User ID</th>
                                                <th className="px-4 py-3">RF Score</th>
                                                <th className="px-4 py-3">Verdict</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-50">
                                            {[
                                                { id: 'USR-8821', score: '0.96', status: 'Reliable', color: 'emerald' },
                                                { id: 'USR-9104', score: '0.65', status: 'Moderate', color: 'orange' },
                                                { id: 'USR-3390', score: '0.21', status: 'Unlikely', color: 'rose' }
                                            ].map((row, i) => (
                                                <tr key={i} className="hover:bg-gray-50 transition-colors">
                                                    <td className="px-4 py-3 font-bold text-gray-700">{row.id}</td>
                                                    <td className="px-4 py-3 font-mono font-black text-teal-600">{row.score}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`bg-${row.color}-50 text-${row.color}-600 px-2.5 py-1 rounded-lg font-black text-[10px] uppercase tracking-tighter`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AIPredictions;