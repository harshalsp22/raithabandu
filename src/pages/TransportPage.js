import React, { useState, useEffect } from 'react';

const TransportPage = ({ currentUser }) => {
    const [activeTab, setActiveTab] = useState('find'); // 'find' or 'register'
    const [trucks, setTrucks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Form State for Drivers
    const [formData, setFormData] = useState({
        vehicleNumber: '',
        vehicleType: 'Tata Ace',
        capacity: '',
        location: ''
    });

    // Fetch trucks when "Find" tab is active
    useEffect(() => {
        if (activeTab === 'find') {
            fetchTrucks();
        }
    }, [activeTab]);

    const fetchTrucks = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch('http://localhost:5000/api/transport/trucks');
            if (!res.ok) {
                throw new Error('Failed to fetch truck data.');
            }
            const data = await res.json();
            setTrucks(data);
        } catch (error) {
            console.error("Error fetching trucks:", error);
            setError("Could not load available transport.");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (!currentUser) {
            alert("Please Login to register your vehicle.");
            return;
        }

        const payload = {
            ...formData,
            // Automatically attach logged-in user details as driver info
            driverName: currentUser.name || "Unknown Driver",
            driverPhone: currentUser.phone
        };

        try {
            const res = await fetch('http://localhost:5000/api/transport/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                alert("Vehicle Registered Successfully!");
                setFormData({ vehicleNumber: '', vehicleType: 'Tata Ace', capacity: '', location: '' });
                setActiveTab('find'); // Switch to list view after successful registration
            } else {
                const errorData = await res.json();
                alert(`Registration Failed: ${errorData.message || 'Check server logs.'}`);
            }
        } catch (error) {
            console.error("Error registering:", error);
            alert("Network error occurred during registration.");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>🚛 Logistics & Transport Hub</h1>

            {/* --- TOGGLE SWITCH --- */}
            <div style={styles.toggleContainer}>
                <button 
                    style={activeTab === 'find' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('find')}
                >
                    Find a Truck
                </button>
                <button 
                    style={activeTab === 'register' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTab('register')}
                >
                    Register as Transporter
                </button>
            </div>

            {/* --- CONTENT AREA --- */}
            <div style={styles.content}>
                
                {/* OPTION 1: FIND TRUCKS (LIST VIEW) */}
                {activeTab === 'find' ? (
                    <div style={styles.listSection}>
                        <h2>Available Transportation Services</h2>
                        {loading && <p>Loading trucks...</p>}
                        {error && <p style={{color: 'red'}}>{error}</p>}
                        
                        {!loading && !error && trucks.length === 0 && (
                            <p>No trucks currently registered. Try registering one!</p>
                        )}
                        
                        {!loading && !error && trucks.map(truck => (
                            <div key={truck._id} style={styles.card}>
                                <div style={styles.cardHeader}>
                                    <h4>{truck.vehicleType} <span style={{fontWeight: 'normal', color: '#666'}}>({truck.vehicleNumber})</span></h4>
                                    <span style={styles.badge}>{truck.location}</span>
                                </div>
                                <p style={styles.detail}><strong>Capacity:</strong> {truck.capacity}</p>
                                <p style={styles.detail}><strong>Driver:</strong> {truck.driverName}</p>
                                <a href={`tel:${truck.driverPhone}`} style={styles.callBtn}>
                                    📞 Call {truck.driverPhone}
                                </a>
                            </div>
                        ))}
                    </div>
                ) : (
                    
                /* OPTION 2: REGISTER FORM */
                    <div style={styles.formContainer}>
                        <h2>Join as a Transporter</h2>
                        <p>Enter your vehicle details to be listed for transportation requests.</p>
                        
                        {!currentUser && <p style={{color:'red', fontWeight: 'bold'}}>⚠️ Please Login First to register your vehicle.</p>}

                        <form onSubmit={handleRegisterSubmit}>
                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Vehicle Type</label>
                                <select 
                                    name="vehicleType" 
                                    value={formData.vehicleType} 
                                    onChange={handleInputChange}
                                    style={styles.input}
                                >
                                    <option>Tata Ace / Mini Truck</option>
                                    <option>Pickup Truck (e.g., Bolero)</option>
                                    <option>Small Lorry (4-6 Wheels)</option>
                                    <option>Tractor Trailer</option>
                                    <option>Other</option>
                                </select>
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Vehicle Number</label>
                                <input 
                                    type="text" 
                                    name="vehicleNumber" 
                                    placeholder="e.g. KA-01-AB-1234"
                                    value={formData.vehicleNumber}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Capacity (Tons/Kg)</label>
                                <input 
                                    type="text" 
                                    name="capacity" 
                                    placeholder="e.g. 2 Tons / 5000 Kg"
                                    value={formData.capacity}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <div style={styles.inputGroup}>
                                <label style={styles.label}>Base Location (City/District)</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    placeholder="e.g. Mandya / Tumkur"
                                    value={formData.location}
                                    onChange={handleInputChange}
                                    required
                                    style={styles.input}
                                />
                            </div>

                            <button type="submit" style={styles.submitBtn} disabled={!currentUser}>
                                Register Vehicle
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- CSS STYLES ---
const styles = {
    container: { padding: '40px', backgroundColor: '#f4f6f8', minHeight: '100vh', maxWidth: '800px', margin: '0 auto' },
    header: { textAlign: 'center', color: '#2e7d32', fontSize: '2rem', marginBottom: '30px' },
    
    toggleContainer: { display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '40px' },
    tab: { padding: '12px 25px', fontSize: '1rem', border: '1px solid #ccc', borderRadius: '30px', cursor: 'pointer', background: 'white' },
    activeTab: { padding: '12px 25px', fontSize: '1rem', border: 'none', borderRadius: '30px', cursor: 'pointer', background: '#2e7d32', color: 'white', fontWeight: 'bold' },
    
    listSection: { padding: '0 10px' },
    
    card: { backgroundColor: 'white', padding: '20px', marginBottom: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', borderLeft: '5px solid #ff9800' },
    cardHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
    badge: { background: '#fff3e0', color: '#ff9800', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', fontWeight: 'bold' },
    detail: { margin: '5px 0', fontSize: '0.95rem' },
    callBtn: { display: 'block', marginTop: '15px', textAlign: 'center', backgroundColor: '#007bff', color: 'white', padding: '12px', textDecoration: 'none', borderRadius: '5px', fontWeight: 'bold' },
    
    formContainer: { background: 'white', padding: '40px', borderRadius: '10px', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' },
    inputGroup: { marginBottom: '20px' },
    label: { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' },
    input: { width: '100%', padding: '12px', marginTop: '5px', border: '1px solid #ccc', borderRadius: '5px', fontSize: '1rem' },
    submitBtn: { width: '100%', padding: '15px', background: '#2e7d32', color: 'white', border: 'none', borderRadius: '5px', fontSize: '1.1rem', cursor: 'pointer', marginTop: '10px', fontWeight: 'bold' }
};

export default TransportPage;