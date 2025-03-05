const jwt = require("jsonwebtoken");

const tokenGenerator = (res, id) => {
  const token = jwt.sign({ id }, "jfam43dcyp434k5l3k5k3j043ek0afsf", {
    expiresIn: "90d",
  });

  const cookieOption = {
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: true, //  only for production
    sameSite: "none",
  };

  const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
  res.cookie("_k_d", token, {
    maxAge: MAX_AGE,
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });

  return token;
};

module.exports = { tokenGenerator };
