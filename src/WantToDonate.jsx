import React, { useState, useEffect } from 'react';

// Reusable Toggle Button for Questionnaire
const ToggleButton = ({ label, name, value, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex space-x-2">
            <button
                type="button"
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${value === 'Yes' ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                onClick={() => onChange(name, 'Yes')}
            >Yes</button>
            <button
                type="button"
                className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${value === 'No' ? 'bg-teal-100 text-teal-700 border border-teal-200' : 'bg-gray-50 text-gray-400 border border-gray-200 hover:bg-gray-100'}`}
                onClick={() => onChange(name, 'No')}
            >No</button>
        </div>
    </div>
);

const WantToDonate = () => {
    // Check local storage immediately for a smoother UI
    const savedName = localStorage.getItem('user_full_name') || localStorage.getItem('userName');
    
    const [donorInfo, setDonorInfo] = useState({ 
        name: savedName || 'Loading...', 
        bloodGroup: 'O+' 
    });
    const [aiInsights, setAiInsights] = useState({ score: 0, forecast: 'Calculating...', slots: [], node: null });
    const [loading, setLoading] = useState(true);
    const [answers, setAnswers] = useState({ unwell: 'No', medication: 'No', tattoo: 'No', travel: 'No' });
    const [selectedTime, setSelectedTime] = useState(null);

    useEffect(() => {
        const fetchInitialData = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await fetch('http://127.0.0.1:8000/api/donation-insights/', {
                    headers: { 
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                if (!response.ok) throw new Error("Server Error");
                
                const data = await response.json();
                
                setAiInsights({
                    score: data.reliability_score || 0.95,
                    forecast: data.forecast || "High demand predicted for your blood type.",
                    slots: data.available_slots || ["09:00 AM", "11:00 AM", "02:00 PM"],
                    node: data.nearest_node
                });

                setDonorInfo({ 
                    name: data.donor_name || savedName || "Donor", 
                    bloodGroup: data.blood_group || "O+" 
                }); 

            } catch (err) {
                console.error("Failed to load insights:", err);
                // Fallback to local storage if API fails
                if (savedName) setDonorInfo(prev => ({ ...prev, name: savedName }));
                else setDonorInfo({ name: "User", bloodGroup: "O+" });
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [savedName]);

    const handleToggle = (name, value) => setAnswers(prev => ({ ...prev, [name]: value }));

    const handleBooking = async () => {
        if (!selectedTime) return alert("Please select a time slot.");
        setLoading(true);
        try {
            const response = await fetch('http://127.0.0.1:8000/api/book-appointment/', {
                method: 'POST',
                headers: { 
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    bloodGroup: donorInfo.bloodGroup,
                    answers: answers,
                    donationType: "Whole Blood",
                    scheduledTime: selectedTime,
                    nodeId: aiInsights.node?.id
                })
            });

            if (response.ok) alert("Appointment Confirmed!");
            else alert("Booking failed. Please check eligibility.");
        } catch (err) {
            alert("Connection error.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500 bg-gray-50/50">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
                            <span className="w-8 h-8 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mr-3 text-sm">1</span>
                            Donor Information
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Name</label>
                                <input type="text" value={donorInfo.name} disabled className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-gray-600 font-medium cursor-not-allowed shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Blood Group</label>
                                <select 
                                    className="w-full bg-white border border-gray-200 px-4 py-3 rounded-xl focus:ring-2 focus:ring-teal-400 font-medium text-gray-800 shadow-sm"
                                    value={donorInfo.bloodGroup}
                                    onChange={(e) => setDonorInfo({...donorInfo, bloodGroup: e.target.value})}
                                >
                                    {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(group => <option key={group}>{group}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="bg-gray-50/80 rounded-2xl p-6 border border-gray-100">
                            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center">
                                <span className="w-2 h-4 bg-teal-500 rounded-full mr-2"></span>
                                Eligibility Check
                            </h4>
                            <ToggleButton label="Felt unwell in the past 14 days?" name="unwell" value={answers.unwell} onChange={handleToggle} />
                            <ToggleButton label="Taking antibiotics?" name="medication" value={answers.medication} onChange={handleToggle} />
                            <ToggleButton label="Tattoo in the last 6 months?" name="tattoo" value={answers.tattoo} onChange={handleToggle} />
                            <ToggleButton label="Traveled abroad in the last 3 months?" name="travel" value={answers.travel} onChange={handleToggle} />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl shadow-xl p-6 text-white border border-gray-700">
                        <h3 className="font-bold mb-2 flex items-center text-sm uppercase tracking-wider">
                            <span className="w-2 h-2 bg-teal-400 rounded-full mr-2 animate-pulse"></span>
                            AI Insights
                        </h3>
                        <p className="text-xs text-gray-300 mb-4 leading-relaxed">{aiInsights.forecast}</p>
                        <div className="bg-white/10 p-4 rounded-2xl border border-white/20 backdrop-blur-sm">
                            <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-2">Reliability Score</p>
                            <div className="flex items-center">
                                <div className="flex-1 bg-gray-700 rounded-full h-2 mr-3 overflow-hidden">
                                    <div className="bg-teal-400 h-full rounded-full transition-all duration-1000" style={{ width: `${aiInsights.score * 100}%` }}></div>
                                </div>
                                <span className="text-teal-400 font-bold text-xs">{(aiInsights.score * 100).toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
                        <h4 className="font-bold text-gray-800 mb-4 text-sm">{aiInsights.node?.name || 'Nearest Center'}</h4>
                        <div className="grid grid-cols-3 gap-2 mb-6">
                            {aiInsights.slots.map(slot => (
                                <button 
                                    key={slot}
                                    onClick={() => setSelectedTime(slot)}
                                    className={`py-2 text-xs font-bold rounded-xl border transition-all ${selectedTime === slot ? 'bg-teal-500 border-teal-500 text-white shadow-md' : 'bg-white border-gray-200 text-gray-600 hover:border-teal-400'}`}
                                >{slot}</button>
                            ))}
                        </div>
                        <button 
                            onClick={handleBooking}
                            className="w-full bg-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-teal-600 transition-all disabled:opacity-50 active:scale-95"
                            disabled={loading || !selectedTime}
                        >
                            Confirm Whole Blood Donation
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WantToDonate;