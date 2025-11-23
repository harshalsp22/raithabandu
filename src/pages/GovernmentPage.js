import React from 'react';
import { useTranslation } from 'react-i18next';

const GovernmentPage = () => {
    const { t } = useTranslation();

    // --- MOCK DATA: AGRICULTURAL SCHEMES ---
    // Replace these links and descriptions with actual data (e.g., PM-KISAN, Fasal Bima Yojana, State Schemes)
    const schemes = [
        {
            id: 1,
            title: t('scheme_pm_kisan') || "PM-KISAN Scheme",
            icon: '💰',
            description: t('scheme_pm_kisan_desc') || "Direct income support to all eligible farmer families across the country.",
            link: "https://pmkisan.gov.in/",
            status: "Central"
        },
        {
            id: 2,
            title: t('scheme_fby') || "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
            icon: '🛡️',
            description: t('scheme_fby_desc') || "Crop insurance scheme against non-preventable natural risks.",
            link: "https://pmfby.gov.in/",
            status: "Central"
        },
        {
            id: 3,
            title: t('scheme_soil_health') || "Soil Health Card Scheme",
            icon: '🧪',
            description: t('scheme_soil_health_desc') || "Provides information on soil nutrient status and fertilizer recommendation.",
            link: "https://soilhealth.dac.gov.in/",
            status: "Central"
        },
        {
            id: 4,
            title: t('scheme_organic') || "Paramparagat Krishi Vikas Yojana (PKVY)",
            icon: '🌿',
            description: t('scheme_organic_desc') || "Supports and promotes organic farming through cluster approach.",
            link: "https://pgsindia-ncof.gov.in/PKVY/index.aspx",
            status: "Central"
        }
    ];

    // --- MOCK DATA: GOVERNMENT HELPLINES & SUPPORT ---
    const support = [
        {
            id: 1,
            title: t('support_kisan_call') || "Kisan Call Centre (KCC)",
            icon: '📞',
            detail: "1800-180-1551",
            type: "Phone",
            desc: t('support_kisan_call_desc') || "Toll-free advisory on farming, weather, and market information."
        },
        {
            id: 2,
            title: t('support_weather') || "IMD Weather Forecast",
            icon: '☁️',
            detail: "https://mausam.imd.gov.in/",
            type: "Web",
            desc: t('support_weather_desc') || "Official source for weather warnings and agricultural advisories."
        },
        {
            id: 3,
            title: t('support_kvk') || "Krishi Vigyan Kendra (KVK)",
            icon: '🧑‍🏫',
            detail: "Find Local KVK",
            type: "Location",
            desc: t('support_kvk_desc') || "Local training and knowledge transfer centers for farmers."
        }
    ];

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>🏛️ {t('government') || "Government Schemes & Farmer Support"}</h1>
            <p style={styles.subHeader}>Explore central schemes and access vital helplines.</p>

            {/* --- SECTION 1: KEY GOVERNMENT SCHEMES --- */}
            <h2 style={styles.sectionTitle}>💰 Agricultural Schemes & Financial Aid</h2>
            <div style={styles.grid}>
                {schemes.map(scheme => (
                    <div key={scheme.id} style={styles.card}>
                        <div style={styles.cardIcon}>{scheme.icon}</div>
                        <h3 style={styles.cardTitle}>{scheme.title}</h3>
                        <p style={styles.cardDescription}>{scheme.description}</p>
                        <span style={styles.statusBadge}>{scheme.status}</span>
                        <a 
                            href={scheme.link} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            style={styles.actionBtn}
                        >
                            View Details / Apply
                        </a>
                    </div>
                ))}
            </div>

            <hr style={styles.divider} />

            {/* --- SECTION 2: HELPLINES AND DIRECT SUPPORT --- */}
            <h2 style={styles.sectionTitle}>📞 Direct Helplines & Support</h2>
            <div style={styles.grid}>
                {support.map(item => (
                    <div key={item.id} style={{...styles.card, borderLeftColor: '#007bff'}}>
                        <div style={styles.cardIcon}>{item.icon}</div>
                        <h3 style={styles.cardTitle}>{item.title}</h3>
                        <p style={styles.cardDescription}>{item.desc}</p>
                        <p style={styles.contactDetail}>
                            <strong>{item.type}:</strong> {item.detail}
                        </p>
                        {item.type === 'Phone' && (
                            <a href={`tel:${item.detail}`} style={{...styles.actionBtn, backgroundColor: '#007bff'}}>
                                Call Now
                            </a>
                        )}
                        {item.type === 'Web' && (
                            <a href={item.detail} target="_blank" rel="noopener noreferrer" style={{...styles.actionBtn, backgroundColor: '#007bff'}}>
                                Visit Website
                            </a>
                        )}
                        {item.type === 'Location' && (
                            <a href="https://kvk.icar.gov.in/SearchKVK.aspx" target="_blank" rel="noopener noreferrer" style={{...styles.actionBtn, backgroundColor: '#007bff'}}>
                                Search Map
                            </a>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- CSS STYLES ---
const styles = {
    container: { 
        padding: '40px', 
        backgroundColor: '#f4f6f8', 
        minHeight: '100vh', 
        maxWidth: '1000px', 
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif'
    },
    header: { 
        textAlign: 'center', 
        color: '#2e7d32', 
        fontSize: '2.5rem', 
        marginBottom: '10px' 
    },
    subHeader: { 
        textAlign: 'center', 
        color: '#666', 
        marginBottom: '40px' 
    },
    sectionTitle: {
        color: '#333',
        borderBottom: '2px solid #ccc',
        paddingBottom: '10px',
        marginBottom: '30px',
        marginTop: '40px'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '25px',
    },
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        borderLeft: '5px solid #ff9800',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'transform 0.2s',
    },
    cardIcon: {
        fontSize: '2.5rem',
        marginBottom: '10px',
        lineHeight: 1
    },
    cardTitle: {
        fontSize: '1.3rem',
        margin: '0 0 10px 0',
        color: '#333'
    },
    cardDescription: {
        color: '#666',
        lineHeight: '1.4',
        marginBottom: '15px',
        flexGrow: 1
    },
    statusBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#e8f5e9',
        color: '#2e7d32',
        padding: '4px 10px',
        borderRadius: '15px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginBottom: '10px'
    },
    contactDetail: {
        color: '#007bff',
        fontWeight: 'bold',
        marginBottom: '15px'
    },
    actionBtn: {
        backgroundColor: '#ff9800',
        color: 'white',
        padding: '12px 20px',
        textDecoration: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop: '10px',
        transition: 'background-color 0.2s'
    },
    divider: {
        border: '0',
        height: '1px',
        background: '#e0e0e0',
        margin: '50px 0'
    }
};

export default GovernmentPage;