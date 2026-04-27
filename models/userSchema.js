// import mongoose from "mongoose";
// import bcrypt from "bcrypt";
// import jwt from "jsonwebtoken";
// import crypto from "crypto"

// const userSchema = new mongoose.Schema({
//   fullName: {
//     type: String,
//     required: [true, "Name Required!"],
//   },
//   email: {
//     type: String,
//     required: [true, "Email Required!"],
//   },
//   phone: {
//     type: String,
//     required: [true, "Phone Required!"],
//   },
//   aboutMe: {
//     type: String,
//     required: [true, "About Me Section Is Required!"],
//   },
//   password: {
//     type: String,
//     required: [true, "Password Required!"],
//     minLength: [8, "Password Must Contain At Least 8 Characters!"],
//     select: false
//   },
//   avatar: {
//     public_id: {
//       type: String,
//       required: true,
//     },
//     url: {
//       type: String,
//       required: true,
//     },
//   },
//   resume: {
//     public_id: {
//       type: String,
//       required: true,
//     },
//     url: {
//       type: String,
//       required: true,
//     },
//   },
//   portfolioURL: {
//     type: String,
//     required: [true, "Portfolio URL Required!"],
//   },
//   githubURL: {
//     type: String,
//   },
//   instagramURL: {
//     type: String,
//   },
//   twitterURL: {
//     type: String,
//   },
//   linkedInURL: {
//     type: String,
//   },
//   facebookURL: {
//     type: String,
//   },
//   resetPasswordToken: String,
//   resetPasswordExpire: Date,
// });

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }
//   this.password = await bcrypt.hash(this.password, 10);
// });

// userSchema.methods.comparePassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// userSchema.methods.generateJsonWebToken = function () {
//   return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
//     expiresIn: process.env.JWT_EXPIRES,
//   });
// };


// //Generating Reset Password Token
// userSchema.methods.getResetPasswordToken = function () {
//   //Generating Token
//   const resetToken = crypto.randomBytes(20).toString("hex");

//   //Hashing and Adding Reset Password Token To UserSchema
//   this.resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(resetToken)
//     .digest("hex");

//   //Setting Reset Password Token Expiry Time
//   this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;

//   return resetToken;
// };


// export const User = mongoose.model("User", userSchema);


import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Name Required!"],
  },
  email: {
    type: String,
    required: [true, "Email Required!"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    default: "",        // ← required hata diya
  },
  aboutMe: {
    type: String,
    default: "Portfolio user", // ← required hata diya
  },
  password: {
    type: String,
    required: [true, "Password Required!"],
    minLength: [8, "Password Must Contain At Least 8 Characters!"],
    select: false,
  },
  avatar: {
    public_id: { type: String, default: "default_avatar" },
    url: { type: String, default: "https://via.placeholder.com/150" },
  },
  resume: {
    public_id: { type: String, default: "default_resume" },
    url: { type: String, default: "https://via.placeholder.com/150" },
  },
  portfolioURL: {
    type: String,
    default: "",        // ← required hata diya
  },
  githubURL:    { type: String, default: "" },
  instagramURL: { type: String, default: "" },
  twitterURL:   { type: String, default: "" },
  linkedInURL:  { type: String, default: "" },
  facebookURL:  { type: String, default: "" },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
}, { timestamps: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateJsonWebToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: process.env.JWT_EXPIRES || "7d",
  });
};

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256").update(resetToken).digest("hex");
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
  return resetToken;
};

export const User = mongoose.model("User", userSchema);