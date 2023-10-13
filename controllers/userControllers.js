const bcrypt = require("bcrypt");
const user = require("../model/userModel");
const jwt = require("jsonwebtoken");

const signup = async (req, res) => {
  try {
    const { firstName, lastName, DOB, mobile, email, password } = req.body;
    if (!(firstName && lastName && DOB && mobile && email && password)) {
      return res.status(400).json("All field are required");
    }
    const isUserExist = await user.findOne({ email: email });
    if (isUserExist) {
      return res.status(400).json("User already exists");
    }
    const hashPassword = await bcrypt.hash(password, 12);
    const data = await user.create({
      firstName,
      lastName,
      DOB,
      mobile,
      email,
      password: hashPassword,
    });
    const token = genrateToken(data._id, data.email);
    return res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (error) {
    return res
      .status(500)
      .json("Internal server error please try after some time!");
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(400).json("All field are required");
    }
    const emailChack = await user.findOne({ email: email });
    if (!emailChack) {
      return res
        .status(400)
        .json({ status: "failed", message: "User not found" });
    }
    const matchPassword = await bcrypt.compare(password, emailChack.password);
    if (!matchPassword) {
      return res.status(400).json({
        status: "failed",
        message: "Password Incorrect !",
      });
    }
    const token = genrateToken(emailChack._id, email);
    return res.status(200).json({
      status: "success",
      token: token,
    });
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error please try after some time!",
    });
  }
};

const allUsers = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const tokenVarify = verifyToken(token);
    const userChack = await user.findOne({ _id: tokenVarify.id });
    if (!userChack) {
      return res.status(400).json({
        status: "faield",
        message: "token Invalid",
      });
    }
    const allUser = await user.find();
    return res.status(200).json({
      status: "success",
      result: allUser,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ status: "failed", message: "Token expired" });
    }
    return res.status(500).json({
      status: "faield",
      message: "Internal server error please try after some time!",
    });
  }
};

const update = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const tokenVarify = verifyToken(token);
    const { firstName, lastName, DOB, mobile, email } = req.body;
    if (!(firstName && lastName && DOB && mobile && email)) {
      return res
        .status(400)
        .json({ status: "faield", message: "All field are required" });
    }
    const userChack = await user.findOne({ _id: tokenVarify.id });
    if (userChack.email !== tokenVarify.email) {
      return res
        .status(400)
        .json({ status: "faield", message: "do not update user" });
    }
    const updateUser = await user.findByIdAndUpdate(
      { _id: tokenVarify.id },
      {
        firstName,
        lastName,
        DOB,
        mobile,
        email,
      }
    );
    const tokenGenrate = genrateToken(updateUser._id, updateUser.email);
    return res.status(200).json({
      status: "success",
      message: "User updated successfully",
      token: tokenGenrate,
    });
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res
        .status(403)
        .json({ status: "failed", message: "Token expired" });
    }
    return res.status(500).json({
      status: "faield",
      message: "Internal server error please try after some time!",
    });
  }
};

const genrateToken = (id, email) => {
  const token = jwt.sign({ id, email }, process.env.JWT_SECRET, {
    expiresIn: "24h",
  });
  return token;
};
const verifyToken = (token) => {
  const authToken = token.split(" ")[1];
  const userData = jwt.verify(authToken, process.env.JWT_SECRET);
  return userData;
};

module.exports = {
  signup,
  login,
  allUsers,
  update,
};
