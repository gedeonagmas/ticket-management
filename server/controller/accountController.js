const AppError = require("../utils/AppError");
const asyncCatch = require("express-async-catch");
const { User } = require("../models/userModel");
const { tokenGenerator } = require("../utils/tokenGenerator");
const crypto = require("crypto");
const { sendEmailHandler } = require("./emailController");
const api = `${process.env.API_URL}/uploads/`;

const signupHandler = asyncCatch(async (req, res, next) => {
  const user = await User.create({
    ...req.body,
    profilePicture: req.files?.profilePicture
      ? api + req.files.profilePicture[0]?.filename
      : undefined,
  });

  const token = tokenGenerator(res, user._id);

  return res.status(200).json({
    message: "Account Created Successfully",
    token: token ? token : null,
    data: user,
  });
});

const loginHandler = asyncCatch(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("provide email and password", 404));
  const user = await User.findOne({ email }).select("+password");
  if (!user) return next(new AppError("Invalid email or password", 404));

  const isPasswordCorrect = await user.passwordCheck(user.password, password);
  if (!isPasswordCorrect)
    return next(new AppError("Invalid user name or password", 404));

  const token = tokenGenerator(res, user._id);

  const data = { ...user };
  delete data._doc.password;
  res.status(200).json({
    status: "success",
    message: "you are logged in successfully",
    data: data._doc,
    token,
  });
});

const logoutHandler = asyncCatch(async (req, res, next) => {
  res.cookie("_k_d", "", { maxAge: 1 });
  res.status(200).json({
    message: "Log out successful",
  });
});

const forgetPassword = asyncCatch(async (req, res, next) => {
  const { email } = req.body;
  if (!email)
    return next(new AppError("please provide your email address", 404));
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError("There is no user registered by this email"));

  const resetTokenUrl = await user.createResetToken();
  await user.save({ validateBeforeSave: true });
  const passwordResetUrl = `${process.env.API_URL}/reset}?${resetTokenUrl}`; // this url will sent via email

  const subject = "Ticket Management --> Reset your password";
  const response =
    "We have just sent a verification link via your email address please check. it's valid only for 30 minutes";
  const html = `<div>This is your verification link click <a style={{background:'yellow',padding:'5px', border-radius:'20px',color:white,padding:10px;}} href="${passwordResetUrl}">here</a> to reset your password</div>`;

  //send email
  sendEmailHandler({ email, res, next, subject, response, html });
});

const resetPassword = asyncCatch(async (req, res, next) => {
  //decode reset token
  const resetToken = await crypto
    .createHash("sha256")
    .update(req.query.resetToken)
    .digest("hex");

  //find users by this token
  const user = await User.findOne({
    resetToken,
  }).select("+password");

  if (!req.body.confirmPassword || !req.body.password) {
    return next(new AppError("Password and Confirm password are required"));
  }

  if (req.body.confirmPassword !== req.body.password) {
    return next(new AppError("Password not much"));
  }

  if (!user) return next(new AppError("Invalid Token", 404));

  const isTokenExpired = await user.isTokenExpired();
  if (isTokenExpired) return next(new AppError("Token Expired", 404));

  //save new password to the database
  user.password = req.body.password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  user.save({ validateBeforeSave: true });

  const token = tokenGenerator(res, user._id);

  res.status(201).json({
    status: "success",
    message: "Your password changed successfully",
    token,
  });
});

const updatePassword = asyncCatch(async (req, res, next) => {
  const { newPassword, currentPassword, confirmPassword } = req.body;

  if (!newPassword || !currentPassword || !confirmPassword)
    return next(new AppError("All fields are required", 404));

  const user = await User.findOne({ _id: req.user._id }).select("+password");

  if (newPassword !== confirmPassword)
    return next(new AppError("Password not much", 404));

  if (!user) return next(new AppError("Please login first to proceed", 404));

  //check current password
  const isPasswordCorrect = await user.passwordCheck(
    user.password,
    currentPassword
  );
  if (!isPasswordCorrect)
    return next(new AppError("Your current password is incorrect", 404));

  //save new password to the database
  user.password = newPassword;
  const data = await user.save({ validateBeforeSave: true });

  if (!data)
    return next(new AppError("Error unable to update the password", 404));

  res
    .status(200)
    .json({ status: "Changed", message: "Password changed successfully" });
});

module.exports = {
  signupHandler,
  loginHandler,
  logoutHandler,
  forgetPassword,
  resetPassword,
  updatePassword,
};
