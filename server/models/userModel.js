const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const valid = require("../utils/validator");
const uniqueValidator = require("mongoose-unique-validator");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: [true, "This email address is taken"],
      validate: valid.email("Email"),
      required: [true, "Email is required"],
    },

    role: { type: String, default: "user" },

    firstName: {
      type: String,
      validate: valid.name("First name"),
    },

    lastName: {
      type: String,
      validate: valid.name("Last name"),
    },

    profilePicture: {
      type: String,
      default: "",
    },

    password: {
      type: String,
      select: false,
      validate: valid.password("Password"),
    },

    confirmPassword: {
      type: String,
      validate: valid.confirmPassword("Confirm password"),
    },

    isActive: { type: Boolean, default: true },
    modifiedDate: Number,
    passwordChangedAt: Number,
    resetToken: String,
    resetTokenExpires: Number,
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.confirmPassword = undefined;
  next();
});

userSchema.methods.passwordCheck = async (
  currentPassword,
  candidatePassword
) => {
  return await bcrypt.compare(candidatePassword, currentPassword);
};

userSchema.methods.isPasswordChanged = async function (iat) {
  return iat <= parseInt(this.passwordChangedAt / 1000, 10);
};

userSchema.methods.createResetToken = async function () {
  const resetToken = await crypto.randomBytes(32).toString("hex");
  this.resetToken = await crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.resetTokenExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

userSchema.methods.isTokenExpired = async function () {
  return this.resetTokenExpires < Date.now();
};

userSchema.pre("findOneAndUpdate", function (next) {
  this.options.runValidators = true;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() + 1000;
  next();
});

uniqueValidator.defaults.message = "{PATH} '{VALUE}' is taken";
userSchema.plugin(uniqueValidator);
const User = mongoose.model("user", userSchema);
module.exports = { User };
