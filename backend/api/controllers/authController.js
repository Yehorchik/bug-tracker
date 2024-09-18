import bcrypt from "bcryptjs";
import passport from "passport";
import User from "../../db/models/User.js";

const signup = async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;

    if (!email || !firstName || !lastName || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists with that email." });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    await newUser.save();

    req.logIn(newUser, (err) => {
      if (err) {
        return res
          .status(500)
          .json({ message: "Internal server error during login process." });
      }
      res.status(201).json({
        message: "User successfully created and logged in",
        userId: newUser._id,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error during signup." });
  }
};

// Local login
const login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(400).json(info);
    }
    req.logIn(user, (err) => {
      if (err) return next(err);
      return res.json({
        message: "User has been successfully logged in",
        userId: user._id,
      });
    });
  })(req, res, next);
};

// // Google login redirect
// const googleLogin = (req, res) => {
//   //   passport.authenticate("google", { scope: ["profile", "email"] })(req, res);
// };

// // Google OAuth callback
// const googleCallback = (req, res, next) => {
//   //   passport.authenticate("google", {
//   //     successRedirect: "/", // or your success route
//   //     failureRedirect: "/login", // or your failure route
//   //   })(req, res, next);
// };

const logout = (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error while logging out, try again" });
    }
    res.clearCookie("connect.sid");
    res.status(200).json({ message: "User has successfully logged out." });
  });
};

export { signup, login, logout };
