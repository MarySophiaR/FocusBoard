import jwt from "jsonwebtoken";
const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({
        error: "Access denied. No token provided."
      });
    }
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.replace("Bearer ", "")
      : authHeader;
    const verified = jwt.verify(
      token,
      process.env.JWT_SECRET
    );
    req.user = verified;
    next();
  }
  catch (err) {
    return res.status(401).json({
      error: "Invalid token"
    });
  }
};
export default authMiddleware;