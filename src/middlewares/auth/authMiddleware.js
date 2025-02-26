import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "If you have registered, please check your email to confirm authentication.",
    });
  }

  try {
    console.log("BEFOREE================================================");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("AFTER================================================");
    console.log(decoded);
    // user : { id : 45867876543 }
    
    req.user = decoded; 
    next();
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Invalid token.",
    });
  }
};

export default authMiddleware;