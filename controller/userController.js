// import { v2 as cloudinary } from "cloudinary";
// import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
// import { User } from "../models/userSchema.js";
// import ErrorHandler from "../middlewares/error.js";
// import { generateToken } from "../utils/jwtToken.js";
// import crypto from "crypto";
// import { sendEmail } from "../utils/sendEmail.js";

// export const register = catchAsyncErrors(async (req, res, next) => {
//   const {
//     fullName,
//     email,
//     phone,
//     aboutMe,
//     password,
//     portfolioURL,
//     githubURL,
//     instagramURL,
//     twitterURL,
//     facebookURL,
//     linkedInURL,
//   } = req.body;

//   // Check required fields - only email and password required
//   if (!email || !password) {
//     return next(new ErrorHandler("Please provide email and password", 400));
//   }

//   // Set defaults for optional fields
//   const userData = {
//     fullName: fullName || "User",
//     email,
//     phone: phone || "",
//     aboutMe: aboutMe || "Portfolio user",
//     password,
//     portfolioURL: portfolioURL || "",
//     githubURL: githubURL || "",
//     instagramURL: instagramURL || "",
//     twitterURL: twitterURL || "",
//     facebookURL: facebookURL || "",
//     linkedInURL: linkedInURL || "",
//   };

//   // Handle avatar upload (optional)
//   let avatarData = {
//     public_id: "default_avatar",
//     url: "https://via.placeholder.com/150x150.png?text=Avatar"
//   };

//   if (req.files && req.files.avatar) {
//     const cloudinaryResponseForAvatar = await cloudinary.uploader.upload(
//       req.files.avatar.tempFilePath,
//       { folder: "PORTFOLIO AVATAR" }
//     );
//     if (!cloudinaryResponseForAvatar || cloudinaryResponseForAvatar.error) {
//       console.error(
//         "Cloudinary Error:",
//         cloudinaryResponseForAvatar.error || "Unknown Cloudinary error"
//       );
//       return next(new ErrorHandler("Failed to upload avatar to Cloudinary", 500));
//     }
//     avatarData = {
//       public_id: cloudinaryResponseForAvatar.public_id,
//       url: cloudinaryResponseForAvatar.secure_url,
//     };
//   }

//   // Handle resume upload (optional)
//   let resumeData = {
//     public_id: "default_resume",
//     url: "https://via.placeholder.com/150x200.png?text=Resume"
//   };

//   if (req.files && req.files.resume) {
//     const cloudinaryResponseForResume = await cloudinary.uploader.upload(
//       req.files.resume.tempFilePath,
//       { folder: "PORTFOLIO RESUME" }
//     );
//     if (!cloudinaryResponseForResume || cloudinaryResponseForResume.error) {
//       console.error(
//         "Cloudinary Error:",
//         cloudinaryResponseForResume.error || "Unknown Cloudinary error"
//       );
//       return next(new ErrorHandler("Failed to upload resume to Cloudinary", 500));
//     }
//     resumeData = {
//       public_id: cloudinaryResponseForResume.public_id,
//       url: cloudinaryResponseForResume.secure_url,
//     };
//   }

//   const user = await User.create({
//     ...userData,
//     avatar: avatarData,
//     resume: resumeData,
//   });
//   generateToken(user, "Registered!", 201, res);
// });

// export const login = catchAsyncErrors(async (req, res, next) => {
//   console.log("LOGIN API HIT ✅");
//   const { email, password } = req.body;
//   if (!email || !password) {
//     return next(new ErrorHandler("Provide Email And Password!", 400));
//   }
//   const user = await User.findOne({ email }).select("+password");
//   if (!user) {
//     return next(new ErrorHandler("Invalid Email Or Password!", 401));
//   }
//   const isPasswordMatched = await user.comparePassword(password);
//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Invalid Email Or Password!", 401));
//   }
//   generateToken(user, "Login Successfully!", 200, res);
// });

// // Temporary helper endpoint for local dev/demo: create a quick test account if missing.
// export const seedUser = catchAsyncErrors(async (req, res, next) => {
//   const existing = await User.findOne({ email: "admin@local.dev" });
//   if (existing) {
//     return res.status(200).json({ success: true, message: "Seed user already exists." });
//   }

//   // const user = await User.create({
//   //   fullName: "Local Admin",
//   //   email: "admin@local.dev",
//   //   phone: "0000000000",
//   //   aboutMe: "Auto-seeded local admin",
//   //   password: "password1234",
//   //   portfolioURL: "http://localhost:5174",
//   //   githubURL: "",
//   //   instagramURL: "",
//   //   twitterURL: "",
//   //   facebookURL: "",
//   //   linkedInURL: "",
//   //   avatar: {
//   //     public_id: "seed-avatar",
//   //     url: "https://via.placeholder.com/150",
//   //   },
//   //   resume: {
//   //     public_id: "seed-resume",
//   //     url: "https://via.placeholder.com/150",
//   //   },
//   // });

//   res.status(201).json({ success: true, message: "Seed user created.", user });
// });

// export const logout = catchAsyncErrors(async (req, res, next) => {
//   res
//     .status(200)
//     .cookie("token", "", {
//       httpOnly: true,
//       expires: new Date(Date.now()),
//     })
//     .json({
//       success: true,
//       message: "Logged Out!",
//     });
// });

// export const getUser = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findById(req.user.id);
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// export const updateProfile = catchAsyncErrors(async (req, res, next) => {
//   const newUserData = {
//     fullName: req.body.fullName,
//     email: req.body.email,
//     phone: req.body.phone,
//     aboutMe: req.body.aboutMe,
//     githubURL: req.body.githubURL,
//     instagramURL: req.body.instagramURL,
//     portfolioURL: req.body.portfolioURL,
//     facebookURL: req.body.facebookURL,
//     twitterURL: req.body.twitterURL,
//     linkedInURL: req.body.linkedInURL,
//   };
//   if (req.files && req.files.avatar) {
//     const avatar = req.files.avatar;
//     const user = await User.findById(req.user.id);
//     const profileImageId = user.avatar.public_id;
//     await cloudinary.uploader.destroy(profileImageId);
//     const newProfileImage = await cloudinary.uploader.upload(
//       avatar.tempFilePath,
//       {
//         folder: "PORTFOLIO AVATAR",
//       }
//     );
//     newUserData.avatar = {
//       public_id: newProfileImage.public_id,
//       url: newProfileImage.secure_url,
//     };
//   }

//   if (req.files && req.files.resume) {
//     const resume = req.files.resume;
//     const user = await User.findById(req.user.id);
//     const resumeFileId = user.resume.public_id;
//     if (resumeFileId) {
//       await cloudinary.uploader.destroy(resumeFileId);
//     }
//     const newResume = await cloudinary.uploader.upload(resume.tempFilePath, {
//       folder: "PORTFOLIO RESUME",
//     });
//     newUserData.resume = {
//       public_id: newResume.public_id,
//       url: newResume.secure_url,
//     };
//   }

//   const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
//     new: true,
//     runValidators: true,
//     useFindAndModify: false,
//   });
//   res.status(200).json({
//     success: true,
//     message: "Profile Updated!",
//     user,
//   });
// });

// export const updatePassword = catchAsyncErrors(async (req, res, next) => {
//   const { currentPassword, newPassword, confirmNewPassword } = req.body;
//   const user = await User.findById(req.user.id).select("+password");
//   if (!currentPassword || !newPassword || !confirmNewPassword) {
//     return next(new ErrorHandler("Please Fill All Fields.", 400));
//   }
//   const isPasswordMatched = await user.comparePassword(currentPassword);
//   if (!isPasswordMatched) {
//     return next(new ErrorHandler("Incorrect Current Password!"));
//   }
//   if (newPassword !== confirmNewPassword) {
//     return next(
//       new ErrorHandler("New Password And Confirm New Password Do Not Match!")
//     );
//   }
//   user.password = newPassword;
//   await user.save();
//   res.status(200).json({
//     success: true,
//     message: "Password Updated!",
//   });
// });

// export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
//   const id = "663296a896e553748ab5b0be";
//   const user = await User.findById(id);
//   res.status(200).json({
//     success: true,
//     user,
//   });
// });

// //FORGOT PASSWORD
// export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
//   const user = await User.findOne({ email: req.body.email });
//   if (!user) {
//     return next(new ErrorHandler("User Not Found!", 404));
//   }
//   const resetToken = user.getResetPasswordToken();

//   await user.save({ validateBeforeSave: false });

//   const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;

//   const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl}  \n\n If 
//   You've not requested this email then, please ignore it.`;

//   try {
//     await sendEmail({
//       email: user.email,
//       subject: `Personal Portfolio Dashboard Password Recovery`,
//       message,
//     });
//     res.status(201).json({
//       success: true,
//       message: `Email sent to ${user.email} successfully`,
//     });
//   } catch (error) {
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;
//     await user.save({ validateBeforeSave: false });
//     return next(new ErrorHandler(error.message, 500));
//   }
// });

// //RESET PASSWORD
// export const resetPassword = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.params;
//   const resetPasswordToken = crypto
//     .createHash("sha256")
//     .update(token)
//     .digest("hex");
//   const user = await User.findOne({
//     resetPasswordToken,
//     resetPasswordExpire: { $gt: Date.now() },
//   });
//   if (!user) {
//     return next(
//       new ErrorHandler(
//         "Reset password token is invalid or has been expired.",
//         400
//       )
//     );
//   }

//   if (req.body.password !== req.body.confirmPassword) {
//     return next(new ErrorHandler("Password & Confirm Password do not match"));
//   }
//   user.password = await req.body.password;
//   user.resetPasswordToken = undefined;
//   user.resetPasswordExpire = undefined;

//   await user.save();

//   generateToken(user, "Reset Password Successfully!", 200, res);
// });

import { v2 as cloudinary } from "cloudinary";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { generateToken } from "../utils/jwtToken.js";
import crypto from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

export const register = catchAsyncErrors(async (req, res, next) => {
  const {
    fullName, email, phone, aboutMe, password,
    portfolioURL, githubURL, instagramURL,
    twitterURL, facebookURL, linkedInURL,
  } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please provide email and password", 400));
  }

  // ← Email already registered check
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("Email already registered!", 400));
  }

  const userData = {
    fullName:     fullName     || "User",
    email,
    phone:        phone        || "",
    aboutMe:      aboutMe      || "Portfolio user",
    password,
    portfolioURL: portfolioURL || "",
    githubURL:    githubURL    || "",
    instagramURL: instagramURL || "",
    twitterURL:   twitterURL   || "",
    facebookURL:  facebookURL  || "",
    linkedInURL:  linkedInURL  || "",
  };

  let avatarData = {
    public_id: "default_avatar",
    url: "https://via.placeholder.com/150x150.png?text=Avatar",
  };

  if (req.files && req.files.avatar) {
    try {
      const res = await cloudinary.uploader.upload(
        req.files.avatar.tempFilePath,
        { folder: "PORTFOLIO AVATAR" }
      );
      avatarData = { public_id: res.public_id, url: res.secure_url };
    } catch (err) {
      console.error("Avatar upload failed:", err.message);
      return next(new ErrorHandler("Avatar upload failed", 500));
    }
  }

  let resumeData = {
    public_id: "default_resume",
    url: "https://via.placeholder.com/150x200.png?text=Resume",
  };

  if (req.files && req.files.resume) {
    try {
      const res = await cloudinary.uploader.upload(
        req.files.resume.tempFilePath,
        { folder: "PORTFOLIO RESUME" }
      );
      resumeData = { public_id: res.public_id, url: res.secure_url };
    } catch (err) {
      console.error("Resume upload failed:", err.message);
      return next(new ErrorHandler("Resume upload failed", 500));
    }
  }

  // ← Main try/catch — ab exact error Vercel logs mein aayega
  try {
    const user = await User.create({
      ...userData,
      avatar: avatarData,
      resume: resumeData,
    });
    generateToken(user, "Registered!", 201, res);
  } catch (err) {
    console.error("REGISTER DB ERROR ❌:", err.message);
    return next(new ErrorHandler(err.message, 500));
  }
});

export const login = catchAsyncErrors(async (req, res, next) => {
  console.log("LOGIN API HIT ✅");
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorHandler("Provide Email And Password!", 400));
  }
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid Email Or Password!", 401));
  }
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email Or Password!", 401));
  }
  generateToken(user, "Login Successfully!", 200, res);
});

export const logout = catchAsyncErrors(async (req, res, next) => {
  res.status(200)
    .cookie("token", "", { httpOnly: true, expires: new Date(Date.now()) })
    .json({ success: true, message: "Logged Out!" });
});

export const getUser = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, user });
});

export const updateProfile = catchAsyncErrors(async (req, res, next) => {
  const newUserData = {
    fullName:     req.body.fullName,
    email:        req.body.email,
    phone:        req.body.phone,
    aboutMe:      req.body.aboutMe,
    githubURL:    req.body.githubURL,
    instagramURL: req.body.instagramURL,
    portfolioURL: req.body.portfolioURL,
    facebookURL:  req.body.facebookURL,
    twitterURL:   req.body.twitterURL,
    linkedInURL:  req.body.linkedInURL,
  };

  if (req.files && req.files.avatar) {
    const user = await User.findById(req.user.id);
    await cloudinary.uploader.destroy(user.avatar.public_id);
    const newImg = await cloudinary.uploader.upload(
      req.files.avatar.tempFilePath, { folder: "PORTFOLIO AVATAR" }
    );
    newUserData.avatar = { public_id: newImg.public_id, url: newImg.secure_url };
  }

  if (req.files && req.files.resume) {
    const user = await User.findById(req.user.id);
    if (user.resume.public_id) {
      await cloudinary.uploader.destroy(user.resume.public_id);
    }
    const newResume = await cloudinary.uploader.upload(
      req.files.resume.tempFilePath, { folder: "PORTFOLIO RESUME" }
    );
    newUserData.resume = { public_id: newResume.public_id, url: newResume.secure_url };
  }

  const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
    new: true, runValidators: true, useFindAndModify: false,
  });
  res.status(200).json({ success: true, message: "Profile Updated!", user });
});

export const updatePassword = catchAsyncErrors(async (req, res, next) => {
  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword || !confirmNewPassword) {
    return next(new ErrorHandler("Please Fill All Fields.", 400));
  }
  const user = await User.findById(req.user.id).select("+password");
  const isPasswordMatched = await user.comparePassword(currentPassword);
  if (!isPasswordMatched) {
    return next(new ErrorHandler("Incorrect Current Password!"));
  }
  if (newPassword !== confirmNewPassword) {
    return next(new ErrorHandler("New Password And Confirm New Password Do Not Match!"));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({ success: true, message: "Password Updated!" });
});

export const getUserForPortfolio = catchAsyncErrors(async (req, res, next) => {
  // ← Hardcoded ID ki jagah pehla user fetch karo
  const user = await User.findOne({});
  if (!user) {
    return next(new ErrorHandler("No user found!", 404));
  }
  res.status(200).json({ success: true, user });
});

export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new ErrorHandler("User Not Found!", 404));
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  const resetPasswordUrl = `${process.env.DASHBOARD_URL}/password/reset/${resetToken}`;
  const message = `Your Reset Password Token is:- \n\n ${resetPasswordUrl} \n\n If you've not requested this email then, please ignore it.`;
  try {
    await sendEmail({ email: user.email, subject: "Portfolio Dashboard Password Recovery", message });
    res.status(201).json({ success: true, message: `Email sent to ${user.email} successfully` });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorHandler(error.message, 500));
  }
});

export const resetPassword = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.params;
  const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorHandler("Reset password token is invalid or has been expired.", 400));
  }
  if (req.body.password !== req.body.confirmPassword) {
    return next(new ErrorHandler("Password & Confirm Password do not match"));
  }
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  generateToken(user, "Reset Password Successfully!", 200, res);
});