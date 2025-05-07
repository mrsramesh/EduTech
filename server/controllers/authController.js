


// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const generateToken = require("../utils/generateToken");

// exports.registerUser = async (req, res) => {
//   try {
//     const { fname, lname, email, password, role } = req.body;

//     // Basic validation
//     if (!fname || !lname || !email || !password || !role) {
//       return res.status(400).json({
//         success: false,
//         message: "All fields are required"
//       });
//     }

//     // Check if user already exists
//     const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
//     if (existingUser) {
//       return res.status(409).json({
//         success: false,
//         message: "User already exists with this email"
//       });
//     }

//     // Create new user
//     const user = new User({
//       fname: fname.trim(),
//       lname: lname.trim(),
//       email: email.toLowerCase().trim(),
//       password,
//       role: role.trim()
//     });

//     // Save user (password will be hashed by pre-save hook)
//     await user.save();

//     // Generate JWT token
//     const token = generateToken(user._id);

//     // Return response without password
//     const userObj = user.toObject();
//     delete userObj.password;

//     res.status(201).json({
//       success: true,
//       user: userObj,
//       token
//     });

//   } catch (error) {
//     console.error("Registration error:", error);
    
//     // Handle Mongoose validation errors
//     if (error.name === "ValidationError") {
//       const messages = Object.values(error.errors).map(val => val.message);
//       return res.status(400).json({
//         success: false,
//         message: "Validation error",
//         errors: messages
//       });
//     }

//     res.status(500).json({
//       success: false,
//       message: "Internal server error"
//     });
//   }
// };


// exports.loginUser = async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ message: "Invalid email or password" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

//     // Create a custom user object without password
//     const userData = {
//       _id: user._id,
//       fname: user.fname,
//       lname: user.lname,
//       email: user.email,
//       role: user.role
//     };

//     res.json({
//       message: 'Login successful',
//       user: {
//         _id: user._id,
//         fname: user.fname,
//         lname: user.lname,
//         email: user.email,
//         role: user.role,  // ✅ Add this line
//       },
//       token: generateToken(user._id),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// exports.updateProfile = async (req, res) => {
//   const { id } = req.user;
//   const updateData = req.body;

//   try {
//     const user = await User.findByIdAndUpdate(id, updateData, { new: true });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const { uploadToCloudinary } = require("../utils/cloudinary");
const OTP = require("../models/OTP");
const fs = require('fs');
const path = require('path');
const asyncHandler = require('express-async-handler');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});


// exports.registerUser = asyncHandler(async (req, res) => {
//   const { fname, lname, email, password, role } = req.body;

//   // Debug: Log the email being checked
//   console.log(`Checking for email: ${email}`);

//   // Check if user exists (case-insensitive)
//   const existingUser = await User.findOne({ email: email.toLowerCase() })
//     .collation({ locale: 'en', strength: 2 }); // Case-insensitive search

//   if (existingUser) {
//     console.log(`Found existing user: ${existingUser.email}`);
//     return res.status(409).json({
//       success: false,
//       existingEmail: existingUser.email, // Return the actual stored email
//       message: 'Email already registered'
//     });
//   }

//   // Debug: Before creating new user
//   console.log(`Creating new user with email: ${email.toLowerCase()}`);

//   // Create user
//   const user = await User.create({
//     fname,
//     lname,
//     email: email.toLowerCase(), // Force lowercase
//     password,
//     role,
//     profileImage: req.file ? `/uploads/${req.file.filename}` : null
//   });

//   // Debug: After creation
//   console.log(`Created user:`, user);

//   res.status(201).json({
//     success: true,
//     user: {
//       id: user._id,
//       email: user.email,
//       // ... other fields
//     }
//   });
// });
//change the code password bcypt ke krad taki login ho sake 

// Register a new user 
exports.registerUser = asyncHandler(async (req, res) => {
  const { fname, lname, email, password, role } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Hash the password before saving the user
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user with hashed password
    const user = new User({
      fname,
      lname,
      email: email.toLowerCase(),
      password: hashedPassword,  // Save hashed password
      role
    });

    // Save user to the database
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: { fname: user.fname, email: user.email }
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err.message });
  }
});






exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "Email and password are required" 
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        success: false,
        message: "Invalid credentials" 
      });
    }


    // Create a custom user object without password
    const userData = {
      _id: user._id,
      fname: user.fname,
      lname: user.lname,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage
    };
    res.json({
      success: true,
      message: 'Login successful',
      user: userData,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ 
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "No user found with this email"
      });
    }

    // Generate OTP (6 digits)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    // Save OTP to database
    await OTP.findOneAndUpdate(
      { email: user.email },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    // Send email with OTP
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: user.email,
      subject: "Password Reset OTP",
      html: `
        <p>You requested a password reset. Here is your OTP:</p>
        <h2>${otp}</h2>
        <p>This OTP is valid for 15 minutes.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "OTP sent to your email",
      email: user.email // Return masked email for UI display
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase().trim() 
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "OTP not found or expired"
      });
    }

    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP"
      });
    }

    if (new Date() > otpRecord.expiresAt) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired"
      });
    }

    // Generate a reset token for the password reset screen
    const resetToken = crypto.randomBytes(32).toString("hex");
    await OTP.findOneAndUpdate(
      { email: email.toLowerCase().trim() },
      { resetToken, resetTokenExpires: new Date(Date.now() + 15 * 60 * 1000) },
      { new: true }
    );

    res.json({
      success: true,
      message: "OTP verified successfully",
      resetToken
    });

  } catch (error) {
    console.error("OTP verification error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, resetToken, newPassword } = req.body;

    if (!email || !resetToken || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const otpRecord = await OTP.findOne({ 
      email: email.toLowerCase().trim(),
      resetToken
    });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid reset token"
      });
    }

    if (new Date() > otpRecord.resetTokenExpires) {
      return res.status(400).json({
        success: false,
        message: "Reset token has expired"
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Delete the OTP record
    await OTP.deleteOne({ email: email.toLowerCase().trim() });

    res.json({
      success: true,
      message: "Password reset successfully"
    });

  } catch (error) {
    console.error("Password reset error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const updateData = req.body;
    let profileImage = null;

    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      profileImage = uploadResult.secure_url;
      updateData.profileImage = profileImage;
    }

    // Prevent role and email updates from here
    if (updateData.role || updateData.email) {
      return res.status(400).json({
        success: false,
        message: "Role and email cannot be updated from this endpoint"
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });

  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined
    });
  }
};