// authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./userModel');
require('dotenv').config();

// The secret key for signing JWTs from .env
const jwtSecret = process.env.JWT_SECRET;

// --- SIGN UP LOGIC ---
exports.signup = async (req, res) => {
  const { name, phone, password } = req.body;

  try {
    // 1. Check if user already exists
    let existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this phone number already exists.' });
    }

    // 2. Hash the password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create a new user instance
    const newUser = new User({
      name,
      phone,
      password: hashedPassword, // Store the HASHED password
    });

    // 4. Save user to MongoDB
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully!' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during signup.' });
  }
};


// --- LOGIN LOGIC ---
exports.login = async (req, res) => {
  const { phone, password } = req.body;

  try {
    // 1. Find the user by phone number
    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials (User not found).' });
    }

    // 2. Compare the provided password with the stored HASHED password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials (Password incorrect).' });
    }

    // 3. If credentials are valid, generate a JWT
    const payload = {
      user: {
        id: user.id, // Store user ID in the token payload
        name: user.name,
      },
    };

    jwt.sign(
      payload,
      jwtSecret,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        // 4. Send the token back to the client
        res.json({ 
            message: 'Login successful!',
            token, 
            name: user.name 
        });
      }
    );

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};