const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

// 1. MIDDLEWARE (Crucial for reading JSON data)
app.use(express.json()); 
app.use(cors());

// 2. CONNECT TO MONGODB
mongoose.connect('mongodb://127.0.0.1:27017/farmersApp')
  .then(() => console.log("✅ Connected to Local MongoDB"))
  .catch(err => console.error("❌ DB Connection Error:", err));

// 3. DEFINE SCHEMA
const UserSchema = new mongoose.Schema({
    name: String,
    phone: { type: String, required: true }, // removed unique for testing
    password: { type: String, required: true }
});
const User = mongoose.model('User', UserSchema);

// 4. SIGNUP ROUTE
app.post('/api/signup', async (req, res) => {
    console.log("📝 Signup Request:", req.body); // Debug Log
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

// 5. LOGIN ROUTE (Debug Version)
app.post('/api/login', async (req, res) => {
    console.log("🔑 Login Attempt:", req.body); // <--- THIS WILL SHOW IN TERMINAL

    const { phone, password } = req.body;

    // Check if data arrived
    if (!phone || !password) {
        console.log("❌ Missing phone or password in request");
        return res.status(400).json({ message: "Missing fields" });
    }

    try {
        // Try to find the user
        const user = await User.findOne({ phone: phone, password: password });
        
        if (user) {
            console.log("✅ User Found:", user.name);
            res.json({ message: "Success", user: user });
        } else {
            console.log("⚠️ User not found or password incorrect.");
            // Let's check if the phone exists at least
            const phoneCheck = await User.findOne({ phone: phone });
            if(phoneCheck) {
                console.log("   (Phone exists, but password didn't match)");
            } else {
                console.log("   (Phone number not found in DB)");
            }
            res.status(400).json({ message: "Invalid Credentials" });
        }
    } catch (error) {
        console.error("❌ Database Error during Login:", error);
        res.status(500).json({ message: "Server error during login" });
    }
});
// --- PRODUCT SCHEMA (Add this to server.js) ---
const ProductSchema = new mongoose.Schema({
    sellerName: String,
    sellerPhone: String, // To contact the seller
    productName: { type: String, required: true },
    pricePerKg: { type: Number, required: true },
    quantityAvailable: { type: Number, required: true }, // in Kg
    description: String,
    datePosted: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', ProductSchema);

// --- MARKET ROUTES (Add these routes to server.js) ---

// 1. SELL: Post a new product
app.post('/api/market/sell', async (req, res) => {
    const { sellerName, sellerPhone, productName, pricePerKg, quantityAvailable, description } = req.body;
    try {
        const newProduct = new Product({
            sellerName,
            sellerPhone,
            productName,
            pricePerKg,
            quantityAvailable,
            description
        });
        await newProduct.save();
        res.status(201).json({ message: "Product listed successfully!", product: newProduct });
    } catch (error) {
        res.status(500).json({ message: "Error listing product" });
    }
});

// 2. BUY: Get all products
app.get('/api/market/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ datePosted: -1 }); // Newest first
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Error fetching products" });
    }
});

// 3. BUY ACTION: (Optional - Simple version just deletes/reduces stock)
app.post('/api/market/buy/:id', async (req, res) => {
    try {
        // In a real app, you would create a "Transaction" record here.
        // For now, we will just remove the item or reduce quantity.
        await Product.findByIdAndDelete(req.params.id); 
        res.json({ message: "Product purchased successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error purchasing product" });
    }
});
// --- TRUCK / TRANSPORT SCHEMA ---
const TruckSchema = new mongoose.Schema({
    driverName: String,
    driverPhone: String,
    vehicleNumber: String,
    vehicleType: String, // e.g., Tata Ace, Lorry, Pickup
    capacity: String, // e.g., "2 Tons"
    location: String, // Current City
    isAvailable: { type: Boolean, default: true }
});

const Truck = mongoose.model('Truck', TruckSchema);

// --- TRANSPORT ROUTES ---

// 1. GET ALL TRUCKS (For farmers looking for transport)
app.get('/api/transport/trucks', async (req, res) => {
    try {
        const trucks = await Truck.find({ isAvailable: true });
        res.json(trucks);
    } catch (error) {
        res.status(500).json({ message: "Error fetching trucks" });
    }
});

// 2. REGISTER NEW TRUCK (For drivers)
app.post('/api/transport/register', async (req, res) => {
    console.log("🚛 Registration Attempt Body:", req.body);
    const { driverName, driverPhone, vehicleNumber, vehicleType, capacity, location } = req.body;
    try {
        const newTruck = new Truck({
            driverName,
            driverPhone,
            vehicleNumber,
            vehicleType,
            capacity,
            location
        });
        await newTruck.save();
        res.status(201).json({ message: "Truck registered successfully!" });
    } catch (error) {
        res.status(500).json({ message: "Error registering truck" });
    }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));