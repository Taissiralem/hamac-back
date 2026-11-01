const jwt = require("jsonwebtoken");

// Accepte le token en en-tête `Authorization: Bearer <token>` ou en cookie `token`
exports.adminAuthAndRoleCheck = (req, res, next) => {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : req.cookies?.token;

  if (!token) {
    return res.status(401).json({ message: "Authentication failed" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = { id: decodedToken.id, role: decodedToken.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Authentication failed" });
  }
};
