const jwt = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server-express");
const { promisify } = require("util");
const User = require("../models/user");

const throwAuthError = () => {
  throw new AuthenticationError("Not Authorized to access this resource");
};

const authorize = async (req, verify = false) => {
  const authHeader = req.headers.authorization || "";
  if (!authHeader) {
    req.isAuth = false;
    return !verify ? throwAuthError() : req;
  }

  const token = authHeader.replace("Bearer ", "");
  if (!token || token === "") {
    req.isAuth = false;
    return !verify ? throwAuthError() : req;
  }
  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    req.isAuth = true;

    const user = await User.findById(decoded._id).select("-password");

    if (!user)
      throw new AuthenticationError("Can't find this user in the database");

    req.user = user;
    req.token = token;
    return req;
  } catch (err) {
    req.isAuth = false;
    return !verify ? throwAuthError() : req;
  }
};

module.exports = authorize;
