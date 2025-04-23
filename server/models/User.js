// // const mongoose = require('mongoose');

// // const userSchema = new mongoose.Schema({
// //   email: { type: String, required: true, unique: true },
// //   password: { type: String, required: true }
// // });

// // module.exports = mongoose.model('User', userSchema);


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   fname: String,
//   lname: String,
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   contact: String,
//   address: String,
//   gender: String,
//   age: Number,
//   college: String,
//   class: String,
//   role:String,
// }, { timestamps: true });

// module.exports = mongoose.model("User", userSchema);
// working without chat 


// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema({
//   // Personal Information
//   fname: { type: String, required: true },
//   lname: { type: String, required: true },
//   email: { 
//     type: String, 
//     required: true, 
//     unique: true,
//     match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
//   },
//   password: { 
//     type: String, 
//     required: true,
//     minlength: [6, 'Password must be at least 6 characters long']
//   },
//   contact: { 
//     type: String,
//     validate: {
//       validator: function(v) {
//         return /\d{10}/.test(v);
//       },
//       message: props => `${props.value} is not a valid phone number!`
//     }
//   },
//   address: String,
//   gender: { 
//     type: String,
//     enum: ['male', 'female', 'other', 'prefer-not-to-say'],
//     lowercase: true
//   },
//   age: { 
//     type: Number,
//     min: [13, 'Age must be at least 13'],
//     max: [120, 'Age must be less than 120']
//   },
  
//   // Educational Information
//   college: String,
//   class: String,
  
//   // Role Management
//   role: {
//     type: String,
//     enum: ['student', 'teacher', 'admin'],
//     default: 'student'
//   },
  
//   // Chat/Status Fields
//   online: {
//     type: Boolean,
//     default: false
//   },
//   lastSeen: {
//     type: Date
//   },
//   socketId: {
//     type: String
//   },
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'banned'],
//     default: 'active'
//   },
//   profilePicture: {
//     type: String,
//     default: 'default_profile.jpg'
//   },
  
//   // Verification Fields
//   emailVerified: {
//     type: Boolean,
//     default: false
//   },
//   verificationToken: String,
//   verificationTokenExpires: Date,
  
//   // Security Fields
//   passwordResetToken: String,
//   passwordResetExpires: Date,
//   loginAttempts: {
//     type: Number,
//     default: 0
//   },
//   lockUntil: {
//     type: Date
//   }
  
// }, { 
//   timestamps: true,
//   toJSON: {
//     virtuals: true,
//     transform: function(doc, ret) {
//       delete ret.password;
//       delete ret.__v;
//       return ret;
//     }
//   },
//   toObject: {
//     virtuals: true
//   }
// });

// // Virtual for full name
// userSchema.virtual('fullName').get(function() {
//   return `${this.fname} ${this.lname}`;
// });

// // Indexes for better performance
// userSchema.index({ email: 1 });
// userSchema.index({ online: 1 });
// userSchema.index({ role: 1 });

// // Pre-save hook to hash password
// userSchema.pre('save', async function(next) {
//   if (!this.isModified('password')) return next();
//   try {
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     return next();
//   } catch (err) {
//     return next(err);
//   }
// });

// // Method to compare password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//   return await bcrypt.compare(candidatePassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);




const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  fname: { 
    type: String, 
    required: [true, "First name is required"],
    trim: true
  },
  lname: { 
    type: String, 
    required: [true, "Last name is required"],
    trim: true
  },
  email: { 
    type: String, 
    required: [true, "Email is required"], 
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please fill a valid email address"]
  },
  password: { 
    type: String, 
    required: [true, "Password is required"],
    minlength: [6, "Password must be at least 6 characters"]
  },
  role: {
    type: String,
    required: [true, "Role is required"],
    enum: ["student", "teacher", "admin"],
    default: "student"
  }
}, { 
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    }
  }
});

// Hash password before saving
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", userSchema);