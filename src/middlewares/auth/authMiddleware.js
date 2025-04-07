import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  let token;
  if (req.header("Authorization")) {
    token = req.header("Authorization")?.replace("Bearer ", "")
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt
  }

  if (!token) {
    return res.status(401).json({
      status: "fail",
      message: "Please login first.",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: "Invalid token.",
    });
  }
};

const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to perform this action.",
      });
    }
    next();
  };
}

const tryAuthMiddleware = (req, res, next) => {
  let token;
  // 1. Extract token (same logic as authMiddleware)
  if (req.header("Authorization")) {
    token = req.header("Authorization")?.replace("Bearer ", "");
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // 2. If no token, proceed without setting req.user
  if (!token) {
    return next(); // <<< Simply continue to the next middleware/route handler
  }

  // 3. If token exists, try to verify it
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Attach decoded payload to req.user if valid
    req.user = decoded;
    next(); // <<< Continue with req.user set
  } catch (err) {
    // If token is invalid/expired, log it maybe, but DO NOT block the request
    console.error("Optional Auth: Invalid token received -", err.message);
    next(); // <<< Continue WITHOUT req.user set
  }







};

export { authMiddleware, restrictTo, tryAuthMiddleware };