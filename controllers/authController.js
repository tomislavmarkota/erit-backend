const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ messasge: "All field are required !" });
  }

  const foundUser = await User.findOne({ username }).exec();

  if (!foundUser) {
    res.status(401).json({ message: "Unathorized" });
  }

  const match = bcrypt.compare(password, foundUser.password);

  if (!match) return res.status(400).json({ message: "Unathorized" });

  const accessToken = jwt.sign(
    {
      UserInfo: {
        id: foundUser._id,
        username: foundUser.username,
        roles: foundUser.roles,
      },
    },
    process.env.ACCES_TOKEN_SECRET,
    { expiresIn: "15m" }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ token: accessToken });
};

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies.jwt) return res.status(204); // no content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });
  res.json({ message: "jwt cookie deleted, logout successfull !" });
};

// @desc Refresh
// @route GET /auth/refresh
// @access Public
const refresh = async (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" });

      const foundUser = await User.findOne({
        username: decoded.username,
      }).exec();

      if (!foundUser) return res.status(401).json({ message: "Unauthorized" });

      const accessToken = jwt.sign(
        {
          UserInfo: {
            id: foundUser._id,
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCES_TOKEN_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken });
    }
  );
};

module.exports = {
  login,
  logout,
  refresh,
};
