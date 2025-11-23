import React, { useState, useEffect } from "react";
import styles from './MarketPrice.module.css';

// --- Helper Component: Contact Modal ---
const ContactModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: '#2e7d32' }}>Contact Seller</h2>
        <p>You are interested in: <strong>{product.productName}</strong></p>
        
        <div className={styles.contactDetails}>
          <p><strong>Seller Name:</strong> {product.sellerName}</p>
          <p className={styles.phoneDisplay}>
            📞 {product.sellerPhone || "Phone not available"}
          </p>
          <p style={{ fontSize: '0.9rem', color: '#666' }}>
            Mention that you saw this on <strong>Raitha Bandu</strong> when you call.
          </p>
        </div>

        <button className={styles.closeBtn} onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

// --- Main Component ---
const MarketPrice = ({ currentUser }) => {
  const [activeTab, setActiveTab] = useState("buy"); 
  const [products, setProducts] = useState([]);
  
  // State for the Contact Modal
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Form State for Selling
  const [formData, setFormData] = useState({
    productName: "",
    pricePerKg: "",
    quantityAvailable: "",
    description: ""
  });

  useEffect(() => {
    if (activeTab === 'buy') {
      fetchProducts();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/market/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching market data:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSellSubmit = async (e) => {
    e.preventDefault();
    if (!currentUser) {
      alert("You must be logged in to sell products!");
      return;
    }

    // Convert strings to numbers to prevent backend errors
    const productPayload = {
      productName: formData.productName,
      description: formData.description,
      pricePerKg: Number(formData.pricePerKg),
      quantityAvailable: Number(formData.quantityAvailable),
      sellerName: currentUser.name || "Unknown Farmer",
      sellerPhone: currentUser.phone || "No Phone"
    };

    try {
      const res = await fetch('http://localhost:5000/api/market/sell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productPayload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Product listed successfully!");
        setFormData({ productName: "", pricePerKg: "", quantityAvailable: "", description: "" });
        setActiveTab("buy"); 
      } else {
        alert(`Failed to list product: ${data.message}`);
      }
    } catch (error) {
      console.error("Error selling product:", error);
      alert("Network error.");
    }
  };

  // Instead of buying, we just open the modal
  const handleContactClick = (product) => {
    if (!currentUser) {
      alert("Please login to view seller details.");
      return;
    }
    setSelectedProduct(product);
  };

  return (
    <div className={styles.marketContainer}>
      <h1>🌾 Agricultural Market</h1>
      
      <div className={styles.tabContainer}>
        <button 
          className={`${styles.tab} ${activeTab === 'buy' ? styles.active : ''}`}
          onClick={() => setActiveTab('buy')}
        >
          Find Crops
        </button>
        <button 
          className={`${styles.tab} ${activeTab === 'sell' ? styles.active : ''}`}
          onClick={() => setActiveTab('sell')}
        >
          Sell Your Produce
        </button>
      </div>

      {/* CONTACT MODAL POPUP */}
      {selectedProduct && (
        <ContactModal 
            product={selectedProduct} 
            onClose={() => setSelectedProduct(null)} 
        />
      )}

      <div className={styles.contentArea}>
        {activeTab === 'buy' ? (
          <div className={styles.grid}>
            {products.length === 0 && <p>No products listed yet.</p>}
            {products.map((product) => (
              <div key={product._id} className={styles.card}>
                <div className={styles.cardHeader}>
                    <h3>{product.productName}</h3>
                    <span className={styles.dateTag}>
                        {new Date(product.datePosted).toLocaleDateString()}
                    </span>
                </div>
                
                <p className={styles.price}>₹{product.pricePerKg} <span style={{fontSize:'0.8rem', color:'#666'}}>/ kg</span></p>
                
                <div className={styles.detailsRow}>
                    <span><strong>Qty Available:</strong> {product.quantityAvailable} kg</span>
                    <span><strong>Seller:</strong> {product.sellerName}</span>
                </div>

                <p className={styles.desc}>{product.description}</p>
                
                {/* CHANGED BUTTON TO CONTACT SELLER */}
                <button 
                  className={styles.contactBtn}
                  onClick={() => handleContactClick(product)}
                >
                  📞 Contact Supplier
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className={styles.formContainer}>
            <h2>List Your Produce</h2>
            {!currentUser && <p style={{color:'red'}}>Please Login to Sell</p>}
            <form onSubmit={handleSellSubmit}>
              <div className={styles.inputGroup}>
                <label>Crop Name</label>
                <input 
                  name="productName" 
                  placeholder="e.g. Fresh Tomatoes" 
                  value={formData.productName}
                  onChange={handleInputChange}
                  required 
                />
              </div>
              <div className={styles.row}>
                <div className={styles.inputGroup}>
                    <label>Price per Kg (₹)</label>
                    <input 
                    type="number" 
                    name="pricePerKg" 
                    value={formData.pricePerKg}
                    onChange={handleInputChange}
                    required 
                    />
                </div>
                <div className={styles.inputGroup}>
                    <label>Available Quantity (Kg)</label>
                    <input 
                    type="number" 
                    name="quantityAvailable" 
                    value={formData.quantityAvailable}
                    onChange={handleInputChange}
                    required 
                    />
                </div>
              </div>
              <div className={styles.inputGroup}>
                <label>Description / Quality</label>
                <textarea 
                  name="description" 
                  placeholder="e.g. Organic, harvested today, located in Bangalore..." 
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>
              <button type="submit" className={styles.submitBtn} disabled={!currentUser}>
                List Item
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default MarketPrice;