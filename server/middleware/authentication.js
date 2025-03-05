const { User } = require("../models/userModel");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const authentication = async (req, res, next) => {
  let token, user;
  const header = req.cookies._k_d;
  if (header && header !== "null" && header !== "") {
    token = header;
  }
  if (token === "null" || !token || token === "")
    return next(new AppError("Please login to proceed!"));

  const decode = await promisify(jwt.verify)(
    token,
    "jfam43dcyp434k5l3k5k3j043ek0afsf"
  );

  user = await User.findById(decode.id);
  if (!user) return next(new AppError("users not found", 404));

  if (await user.isPasswordChanged(decode.iat))
    return next(
      new AppError(
        "you have recently changed your password # please login again",
        400
      )
    );
  req.user = user;
  next();
};

module.exports = { authentication };
