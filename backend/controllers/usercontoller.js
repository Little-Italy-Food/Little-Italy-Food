const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/users"); // User model
const Chef = require("../models/chefs"); // Chef model

exports.register = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    let user;

    // Check if user exists based on userType
    if (userType === "customer") {
      user = await User.findOne({ email });
    } else if (userType === "chef") {
      user = await Chef.findOne({ email });
    } else {
      return res.status(400).json({ msg: "Invalid user type" });
    }

    // If user exists, return an error
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Create a new user based on userType
    const newUser =
      userType === "customer"
        ? new User({ username, email, password })
        : new Chef({ username, email, password });

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    // Save the new user
    await newUser.save();
    res.status(201).json({ msg: "User registered successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login function
exports.login = async (req, res) => {
  try {
    const { username, email, password, userType } = req.body;
    let user;

    // Find user based on userType and email
    if (userType === "customer") {
      user = await User.findOne({ email });
    } else if (userType === "chef") {
      user = await Chef.findOne({ email });
    } else {
      return res.status(400).json({ msg: "Invalid user type" });
    }

    // If user not found, return an error
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // Generate JWT token
    const payload = { user: { id: user.id } };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token, userId: user.id });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
