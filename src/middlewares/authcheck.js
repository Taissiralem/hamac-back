const jwt = require("jsonwebtoken");

exports.adminAuthAndRoleCheck = (req, res, next) => {
  const authHeader = req.cookies.token || req.headers.authorization;
  if (
    !authHeader ||
    (!authHeader.startsWith("Bearer ") && !req.cookies.token)
  ) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  const token = req.cookies.token || authHeader.split(" ")[1];
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decodedToken.id, role: decodedToken.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
