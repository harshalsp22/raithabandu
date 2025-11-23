import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

// --- API ENDPOINTS ---
const REWARD_POINTS_API = 'http://localhost:5000/api/rewards/update_points';

// Component requires the current user data (for balance and ID)
// and a function to update the balance in the app state.
const Rewards = ({ currentUser, updateUserPoints }) => {
    const { t } = useTranslation();
    const [message, setMessage] = useState('');
    
    // Safety check: ensure user data is available
    const userPoints = currentUser?.agriPoints || 0;
    const userId = currentUser?._id;

    // --- MOCK DATA: REDEEMABLE REWARDS ---
    const rewards = [
        {
            id: 1,
            title: t('reward_transport_discount') || "₹100 Transport Discount",
            icon: '🚚',
            cost: 5000,
            description: t('reward_transport_desc') || "Redeem for a ₹100 discount coupon on your next transport booking.",
            type: "Discount"
        },
        {
            id: 2,
            title: t('reward_soil_test') || "Free Soil Health Card Voucher",
            icon: '🧪',
            cost: 2500,
            description: t('reward_soil_test_desc') || "A voucher for a free soil test at an approved government lab.",
            type: "Voucher"
        },
        {
            id: 3,
            title: t('reward_premium_access') || "Premium Market Reports",
            icon: '📈',
            cost: 1000,
            description: t('reward_premium_desc') || "Unlock 7-day future price and demand forecasting for key crops.",
            type: "Access"
        },
    ];

    // --- HANDLER: Redemption Process ---
    const handleRedeem = async (reward) => {
        if (!userId) {
            setMessage("Error: User not logged in.");
            return;
        }

        if (userPoints < reward.cost) {
            setMessage(`Insufficient AgriPoints. You need ${reward.cost} to redeem "${reward.title}".`);
            return;
        }

        // 1. Confirm with the user
        if (!window.confirm(`Are you sure you want to spend ${reward.cost} AgriPoints to redeem "${reward.title}"?`)) {
            return;
        }

        try {
            // 2. Call the backend API to deduct points (send negative cost)
            const response = await fetch(REWARD_POINTS_API, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: userId,
                    points: -reward.cost, // Send negative value to deduct
                    reason: `REDEEM_${reward.id}_${reward.title.toUpperCase().replace(/\s/g, '_')}`
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // 3. Update the frontend state
                updateUserPoints(-reward.cost);
                
                // 4. Show success message and provide the reward
                setMessage(`🎉 Success! You redeemed "${reward.title}". Your new balance is ${data.newBalance}.`);
                alert(`Your Reward Code/Link for "${reward.title}" is now available in your profile!`);
            } else {
                setMessage(`Redemption Failed: ${data.message || 'Server error.'}`);
            }

        } catch (error) {
            setMessage("Network Error: Could not connect to reward server.");
            console.error(error);
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.header}>✨ {t('rewards_title') || "AgriPoints Reward Center"}</h1>
            <div style={styles.balanceBox}>
                <h2>{t('current_balance') || "Your Current Balance"}</h2>
                <p style={styles.pointsCount}>
                    <span style={styles.pointsIcon}>💰</span>
                    {userPoints} AgriPoints
                </p>
                <p style={styles.note}>
                    {t('note_earn') || "Earn points by listing products, registering transport, and using ML tools!"}
                </p>
            </div>

            {message && (
                <div style={userPoints < 0 ? styles.errorBox : styles.successBox}>
                    {message}
                </div>
            )}
            
            <h2 style={styles.sectionTitle}>{t('redeem_title') || "Redeem Your Points"}</h2>
            
            <div style={styles.grid}>
                {rewards.map(reward => (
                    <div key={reward.id} style={styles.card}>
                        <div style={styles.cardHeader}>
                            <span style={styles.cardIcon}>{reward.icon}</span>
                            <h3 style={styles.cardTitle}>{reward.title}</h3>
                        </div>
                        <p style={styles.cardDescription}>{reward.description}</p>
                        <button 
                            style={{
                                ...styles.redeemBtn,
                                backgroundColor: userPoints >= reward.cost ? styles.redeemBtn.backgroundColor : styles.disabledBtn.backgroundColor
                            }}
                            onClick={() => handleRedeem(reward)}
                            disabled={userPoints < reward.cost}
                        >
                            {userPoints >= reward.cost ? 
                                `Redeem for ${reward.cost} Points` : 
                                `Needs ${reward.cost - userPoints} more Points`
                            }
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Rewards;

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
        color: '#2e7d32', 
        fontSize: '2.5rem', 
        marginBottom: '30px' 
    },
    sectionTitle: {
        color: '#333',
        borderBottom: '2px solid #ff9800',
        paddingBottom: '10px',
        marginBottom: '30px',
        marginTop: '40px'
    },
    balanceBox: {
        textAlign: 'center',
        padding: '30px',
        backgroundColor: '#e8f5e9', // Light green
        border: '1px solid #c8e6c9',
        borderRadius: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
    },
    pointsCount: {
        fontSize: '3rem',
        fontWeight: 'bold',
        color: '#2e7d32',
        margin: '10px 0'
    },
    pointsIcon: {
        marginRight: '15px'
    },
    note: {
        fontSize: '0.9rem',
        color: '#666'
    },
    successBox: {
        padding: '15px',
        backgroundColor: '#c8e6c9', // lighter success
        color: '#2e7d32',
        border: '1px solid #a5d6a7',
        borderRadius: '5px',
        marginTop: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    errorBox: {
        padding: '15px',
        backgroundColor: '#ffcdd2', // light error red
        color: '#d32f2f',
        border: '1px solid #ef9a9a',
        borderRadius: '5px',
        marginTop: '20px',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    grid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '25px',
    },
    card: {
        backgroundColor: 'white',
        padding: '25px',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        borderTop: '5px solid #2e7d32' // Green accent
    },
    cardHeader: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '10px'
    },
    cardIcon: {
        fontSize: '2rem',
        marginRight: '15px'
    },
    cardTitle: {
        fontSize: '1.2rem',
        margin: '0',
        color: '#333'
    },
    cardDescription: {
        color: '#666',
        lineHeight: '1.4',
        marginBottom: '20px',
        flexGrow: 1
    },
    redeemBtn: {
        backgroundColor: '#ff9800', // Orange primary color
        color: 'white',
        padding: '12px 15px',
        border: 'none',
        borderRadius: '5px',
        fontWeight: 'bold',
        cursor: 'pointer',
        transition: 'background-color 0.2s'
    },
    disabledBtn: {
        backgroundColor: '#ccc', // Gray for disabled state
        cursor: 'not-allowed'
    }
};