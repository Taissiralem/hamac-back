const User = require("../models/user");
const bcrypte = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.signin = async (req, res) => {
  const { email, password } = req.body;
  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Server error" });
  }
  // Même message dans les deux cas pour ne pas révéler quels e-mails existent
  if (
    !existingUser ||
    !password ||
    !bcrypte.compareSync(password, existingUser.password)
  ) {
    return res.status(400).json({ message: "invalid Email / password" });
  }
  const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "Lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
  });

  return res.status(200).json({
    message: "Successfully Logged In",
    user: existingUser,
    token,
  });
};

// Utilisateur connecté (vérifie la validité du token)
exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
};

// exports.signup = async (req, res) => {
//   const { FirstName, LastName, email, password } = req.body;
//   let existingUser;
//   try {
//     existingUser = await User.findOne({ email: email });
//   } catch (err) {
//     console.log(err);
//   }
//   if (existingUser) {
//     return res
//       .status(400)
//       .json({ message: "User already exists! Login instead." });
//   }
//   const hashedPassword = bcrypte.hashSync(password);
//   const user = new User({
//     FirstName,
//     LastName,
//     email,
//     password: hashedPassword,
//   });

//   try {
//     await user.save();
//     const token = jwt.sign(
//       { id: user._id, role: user.role },
//       process.env.JWT_SECRET_KEY
//     );

//     res.cookie("token", token, {
//       // httpOnly: true,
//       sameSite: "Lax",
//       maxAge: 31536000000, // 1 year in milliseconds
//     });

//     return res
//       .status(201)
//       .json({ message: "Successfully Signed Up and Logged In", user, token });
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json({ message: "Error during signup" });
//   }
// };
