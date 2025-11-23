const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads (e.g., in ML routes)
const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporary folder for file uploads

// 1. MIDDLEWARE
app.use(express.json()); // Crucial for reading JSON data from request body
app.use(cors());

// 2. CONNECT TO MONGODB
mongoose.connect('mongodb://127.0.0.1:27017/farmersApp')
  .then(() => console.log("✅ Connected to Local MongoDB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// #################################################
// ## 3. DATABASE SCHEMAS & MODELS                ##
// #################################################

// --- USER SCHEMA (Includes agriPoints for Rewards) ---
const UserSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, required: true },
    password: { type: String, required: true },
    agriPoints: { type: Number, default: 0 } // Reward System Field
});
const User = mongoose.model('User', UserSchema);

// --- PRODUCT SCHEMA (Marketplace) ---
const ProductSchema = new mongoose.Schema({
    sellerName: String,
    sellerPhone: String,
    productName: { type: String, required: true },
    pricePerKg: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true },
    description: String,
    datePosted: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

// --- TRUCK / TRANSPORT SCHEMA ---
const TruckSchema = new mongoose.Schema({
    driverName: String,
    driverPhone: String,
    vehicleNumber: String,
    vehicleType: String,
    capacity: String,
    location: String,
    isAvailable: { type: Boolean, default: true }
});
const Truck = mongoose.model('Truck', TruckSchema);


// #################################################
// ## 4. AUTHENTICATION ROUTES (Signup & Login)   ##
// #################################################

// SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    console.log("📝 Signup Request:", req.body);
    const { name, phone, password } = req.body;
    try {
        const newUser = new User({ name, phone, password });
        await newUser.save();
        console.log("✅ User Saved Successfully");
        res.status(201).json({ message: "User created" });
    } catch (error) {
        console.error("❌ Signup Error:", error);
        res.status(500).json({ message: "Error creating user" });
    }
});

// LOGIN ROUTE
app.post('/api/login', async (req, res) => {
    console.log("🔑 Login Attempt:", req.body);
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        // User object now includes agriPoints
        const user = await User.findOne({ phone: phone, password: password });
        
        if (user) {
            console.log("✅ User Found:", user.name);
            // IMPORTANT: Send the full user object (including _id and agriPoints)
            res.json({ message: "Success", user: user });
        } else {
            console.log("⚠️ User not found or password incorrect.");
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error("❌ Database Error during Login:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});


// #################################################
// ## 5. MARKETPLACE ROUTES                       ##
// #################################################

// 1. SELL: Post a new product
app.post('/api/market/sell', async (req, res) => {
    const { sellerName, sellerPhone, productName, pricePerKg, quantityAvailable, description } = req.body;
    try {
        const newProduct = new Product({ sellerName, sellerPhone, productName, pricePerKg, quantityAvailable, description });
        await newProduct.save();
        res.status(201).json({ message: "Product listed successfully!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error listing product" });
    }
});

// 2. BUY: Get all products
app.get('/api/market/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ datePosted: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// 3. BUY ACTION: Delete product (simulating successful transaction/sale)
app.post('/api/market/buy/:id', async (req, res) => {
    const productId = req.params.id;
    const { buyerId } = req.body; // Requires buyer's ID from frontend

    try {
        const deletedProduct = await Product.findByIdAndDelete(productId); 
        
        if (deletedProduct) {
             // 🎁 REWARD TRIGGER: Award points to the buyer for completing the transaction
             if (buyerId) {
                await User.findByIdAndUpdate(
                    buyerId,
                    { $inc: { agriPoints: 50 } }, // 50 points for buying/contacting
                    { new: true }
                );
             }
        }
        res.json({ message: "Product transaction recorded successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error processing market transaction" });
    }
});


// #################################################
// ## 6. TRANSPORT ROUTES                         ##
// #################################################

// 1. GET ALL TRUCKS
app.get('/api/transport/trucks', async (req, res) => {
    try {
        const trucks = await Truck.find({ isAvailable: true });
        res.json(trucks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trucks" });
    }
});

// 2. REGISTER NEW TRUCK (With Reward)
app.post('/api/transport/register', async (req, res) => {
    console.log("🚛 Registration Attempt Body:", req.body);
    const { driverName, driverPhone, vehicleNumber, vehicleType, capacity, location, userId } = req.body;

    try {
        const newTruck = new Truck({ driverName, driverPhone, vehicleNumber, vehicleType, capacity, location });
        await newTruck.save();

        // 🎁 REWARD TRIGGER: Award points to the driver for registering their vehicle
        if (userId) {
             await User.findByIdAndUpdate(
                userId,
                { $inc: { agriPoints: 500 } }, // 500 points for registering a transport vehicle
                { new: true }
             );
        }
        res.status(201).json({ message: "Truck registered successfully!" });
    } catch (error) {
        console.error("❌ Truck registration error:", error);
        res.status(500).json({ message: "Error registering truck" });
    }
});


// #################################################
// ## 7. REWARD SYSTEM ROUTES                     ##
// #################################################

// Route to add or subtract points from a user (Earning or Redeeming)
app.post('/api/rewards/update_points', async (req, res) => {
    const { userId, points, reason } = req.body; 

    if (!userId || points === undefined) {
        return res.status(400).json({ message: "Missing userId or points amount." });
    }

    try {
        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { agriPoints: points } }, // $inc increments/decrements
            { new: true, select: 'agriPoints name' } 
        );

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        
        console.log(`💰 [POINTS] User: ${user.name} | Change: ${points} | Reason: ${reason || 'N/A'} | New Balance: ${user.agriPoints}`);

        res.json({ 
            newBalance: user.agriPoints, 
            message: `Points successfully ${points >= 0 ? 'awarded' : 'deducted'}.` 
        });

    } catch (error) {
        console.error("❌ Point transaction error:", error);
        res.status(500).json({ message: "Failed to process reward transaction." });
    }
});


// #################################################
// ## 8. MACHINE LEARNING ROUTES (Mocked)         ##
// #################################################

// 1. CROP RECOMMENDATION ROUTE (Receives soil data)
app.post('/api/ml/crop_recommend', async (req, res) => {
    console.log("🌾 Crop Recommendation Request:", req.body);
    const { N, P, K, pH, rainfall } = req.body;
    
    // --- MOCK MODEL RESPONSE (REPLACE WITH REAL PYTHON/TF.JS LOGIC) ---
    let recommendation = "General Crop Mix";
    if (parseFloat(N) > 100 && parseFloat(rainfall) > 150) {
        recommendation = "Paddy (Rice)";
    } else if (parseFloat(pH) > 6.5) {
        recommendation = "Millet (Bajra)";
    }
    
    res.json({
        recommendation: recommendation,
        confidence: "Simulated 95%",
        message: "Model simulation successful."
    });
});

// 2. DISEASE PREDICTION ROUTE (Handles image file upload)
app.post('/api/ml/disease_predict', upload.single('file'), async (req, res) => {
    console.log("🌿 Disease Prediction Request (File Received):", req.file);

    if (!req.file) {
        return res.status(400).json({ message: "No image file uploaded." });
    }

    try {
        // NOTE: In a real app, you would pass req.file.path to your Python ML server here.
        
        // --- MOCK MODEL RESPONSE (REPLACE WITH REAL PYTHON/TF.JS LOGIC) ---
        const predicted_disease = "Potato Late Blight";
        const treatment = "Apply protective fungicides.";
        
        // Optional: Clean up the temporary file (requires 'fs')
        // if (req.file.path) { require('fs').unlinkSync(req.file.path); } 

        res.json({
            disease: predicted_disease,
            treatment: treatment,
            message: "Prediction complete."
        });

    } catch (error) {
        console.error("❌ ML Disease Prediction Error:", error);
        res.status(500).json({ message: "Failed to run prediction model." });
    }
});


// 9. START SERVER
app.listen(5000, () => console.log("🚀 Server running on port 5000")); 