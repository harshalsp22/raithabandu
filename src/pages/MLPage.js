import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- API ENDPOINTS (Matches your server.js) ---
const CROP_RECOMMENDATION_API = 'http://localhost:5000/api/ml/crop_recommend';
const DISEASE_PREDICTION_API = 'http://localhost:5000/api/ml/disease_predict';
const REWARD_POINTS_API = 'http://localhost:5000/api/rewards/update_points';

// Assuming this component is passed the current user and a function to update points
const MLPage = ({ currentUser, updateUserPoints }) => { 
    const { t } = useTranslation();
    const [activeTool, setActiveTool] = useState('crop'); 

    // --- State for Crop Recommendation ---
    const [cropData, setCropData] = useState({ N: 90, P: 42, K: 42, pH: 7.0, rainfall: 200 });
    const [cropResult, setCropResult] = useState(null);
    const [cropLoading, setCropLoading] = useState(false);

    // --- State for Disease Prediction ---
    const [leafImage, setLeafImage] = useState(null);
    const [diseaseResult, setDiseaseResult] = useState(null);
    const [diseaseLoading, setDiseaseLoading] = useState(false);

    // --- HANDLER: Crop Recommendation Submission ---
    const handleCropSubmit = async (e) => {
        e.preventDefault();
        setCropLoading(true);
        setCropResult(null);

        try {
            const response = await fetch(CROP_RECOMMENDATION_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cropData),
            });

            const data = await response.json();
            if (response.ok) {
                 setCropResult(data);
            } else {
                 setCropResult({ error: data.message || "Failed to get recommendation." });
            }

        } catch (error) {
            setCropResult({ error: "Network Error: Check if backend server is running." });
        } finally {
            setCropLoading(false);
        }
    };

    // --- HANDLER: Disease Prediction Submission (Includes Reward Logic) ---
    const handleDiseaseSubmit = async (e) => {
        e.preventDefault();
        if (!leafImage) return alert("Please select a leaf image first.");

        setDiseaseLoading(true);
        setDiseaseResult(null);

        const formData = new FormData();
        formData.append('file', leafImage);

        try {
            const response = await fetch(DISEASE_PREDICTION_API, {
                method: 'POST',
                body: formData, 
            });

            const data = await response.json();
            
            if (response.ok) {
                setDiseaseResult(data);

                // --- 🎁 REWARD TRIGGER ---
                if (currentUser && updateUserPoints) {
                    await fetch(REWARD_POINTS_API, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            userId: currentUser._id,
                            points: 50, // Award 50 points for using ML tool
                            reason: "ML_DISEASE_PREDICT"
                        }),
                    });
                    updateUserPoints(50); // Update frontend state
                    alert("✅ Disease predicted successfully! You earned 50 AgriPoints!");
                }
                // --- END REWARD TRIGGER ---

            } else {
                setDiseaseResult({ error: data.message || "Failed to predict disease." });
            }

        } catch (error) {
            setDiseaseResult({ error: "Network Error: Check if backend server is running." });
        } finally {
            setDiseaseLoading(false);
        }
    };
    
    // --- Render Functions ---

    const renderCropTool = () => (
        <form onSubmit={handleCropSubmit} style={styles.form}>
            <h3>{t('crop_recommend_title') || "Crop Recommendation"}</h3>
            <p style={styles.toolDescription}>Input your soil data to get the optimal crop recommendation.</p>
            {Object.keys(cropData).map(key => (
                <div key={key} style={styles.inputGroup}>
                    <label style={styles.label}>{key} ({key === 'rainfall' ? 'mm' : key === 'pH' ? '' : 'mg/kg'})</label>
                    <input
                        type="number"
                        name={key}
                        step={key === 'pH' ? 0.1 : 1}
                        value={cropData[key]}
                        onChange={(e) => setCropData({ ...cropData, [key]: parseFloat(e.target.value) })}
                        required
                        style={styles.input}
                    />
                </div>
            ))}
            <button type="submit" style={styles.submitBtn} disabled={cropLoading}>
                {cropLoading ? 'Analyzing...' : 'Get Recommendation'}
            </button>
            {cropResult && (
                <div style={styles.resultBox}>
                    {cropResult.error ? (
                        <p style={{color: 'red'}}>Error: {cropResult.error}</p>
                    ) : (
                        <>
                            <h3>✅ Recommended Crop: **{cropResult.recommendation}**</h3>
                            <p>Confidence: {cropResult.confidence}</p>
                        </>
                    )}
                </div>
            )}
        </form>
    );

    const renderDiseaseTool = () => (
        <form onSubmit={handleDiseaseSubmit} style={styles.form}>
            <h3>{t('disease_predict_title') || "Disease Prediction"}</h3>
            <p style={styles.toolDescription}>Upload a clear image of the diseased leaf to predict the likely plant disease.</p>
            <div style={styles.inputGroup}>
                <label style={styles.label}>Upload Leaf Image (JPEG/PNG)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setLeafImage(e.target.files[0])}
                    required
                    style={styles.fileInput}
                />
            </div>
            
            {leafImage && <p style={styles.note}>Selected file: **{leafImage.name}**</p>}

            <button type="submit" style={styles.submitBtn} disabled={diseaseLoading}>
                {diseaseLoading ? 'Predicting...' : 'Predict Disease'}
            </button>
            
            {diseaseResult && (
                <div style={styles.resultBox}>
                    {diseaseResult.error ? (
                        <p style={{color: 'red'}}>Error: {diseaseResult.error}</p>
                    ) : (
                        <>
                            <h3>🚨 Predicted Disease: **{diseaseResult.disease}**</h3>
                            <p style={{marginTop: '10px'}}>**Recommended Treatment:** {diseaseResult.treatment}</p>
                            {currentUser && <p style={{color: '#2e7d32', fontWeight: 'bold'}}>You earned 50 AgriPoints!</p>}
                        </>
                    )}
                </div>
            )}
        </form>
    );

    // --- Main Component Return ---
    return (
        <div style={styles.container}>
            <h1 style={styles.header}>💡 {t('ml') || "Smart Farming ML Tools"}</h1>
            <p style={styles.subHeader}>Leverage open-source machine learning models for actionable insights.</p>
            
            <div style={styles.toggleContainer}>
                <button 
                    style={activeTool === 'crop' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTool('crop')}
                >
                    {t('tab_crop') || 'Crop Recommendation'}
                </button>
                <button 
                    style={activeTool === 'disease' ? styles.activeTab : styles.tab}
                    onClick={() => setActiveTool('disease')}
                >
                    {t('tab_disease') || 'Disease Prediction'}
                </button>
            </div>

            <div style={styles.toolWrapper}>
                {activeTool === 'crop' ? renderCropTool() : renderDiseaseTool()}
            </div>
        </div>
    );
};

export default MLPage;

// --- CSS-IN-JS STYLES ---
const styles = {
    container: { 
        padding: '40px', 
        backgroundColor: '#f4f6f8', 
        minHeight: '100vh', 
        maxWidth: '900px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    header: { 
        textAlign: 'center', 
        color: '#2e7d32', // Dark Green
        fontSize: '2.2rem', 
        marginBottom: '10px' 
    },
    subHeader: { 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '40px' 
    },
    
    toggleContainer: { 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '20px', 
        marginBottom: '40px' 
    },
    tab: { 
        padding: '12px 25px', 
        fontSize: '1rem', 
        border: '1px solid #ccc', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        background: 'white', 
        transition: 'background 0.2s' 
    },
    activeTab: { 
        padding: '12px 25px', 
        fontSize: '1rem', 
        border: 'none', 
        borderRadius: '8px', 
        cursor: 'pointer', 
        background: '#2e7d32', // Dark Green
        color: 'white', 
        fontWeight: 'bold' 
    },
    
    toolWrapper: { 
        backgroundColor: 'white', 
        padding: '30px', 
        borderRadius: '10px', 
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)' 
    },
    toolDescription: { 
        fontSize: '1.1rem', 
        color: '#333', 
        marginBottom: '25px', 
        borderLeft: '3px solid #ff9800', // Orange Accent
        paddingLeft: '10px' 
    },
    
    form: { 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '20px' 
    },
    inputGroup: { 
        display: 'flex', 
        flexDirection: 'column' 
    },
    label: { 
        marginBottom: '5px', 
        fontWeight: 'bold', 
        color: '#555' 
    },
    input: { 
        padding: '10px', 
        border: '1px solid #ccc', 
        borderRadius: '5px', 
        fontSize: '1rem' 
    },
    fileInput: { 
        padding: '10px 0' 
    },
    
    submitBtn: { 
        gridColumn: '1 / -1', // Span full width
        padding: '15px 30px', 
        backgroundColor: '#2e7d32', 
        color: 'white', 
        border: 'none', 
        borderRadius: '5px', 
        fontSize: '1.1rem', 
        cursor: 'pointer', 
        marginTop: '15px', 
        fontWeight: 'bold',
        transition: 'background-color 0.2s',
        '&:hover': {
            backgroundColor: '#388e3c' // Slightly lighter green on hover
        }
    },
    
    resultBox: {
        gridColumn: '1 / -1',
        marginTop: '30px',
        padding: '20px',
        backgroundColor: '#e8f5e9', // Light green background
        border: '1px solid #c8e6c9',
        borderRadius: '8px'
    },
    note: {
        fontSize: '0.85rem',
        color: '#666',
        marginTop: '10px',
        fontStyle: 'italic'
    }
};