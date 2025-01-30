import jwt from "jsonwebtoken";

const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;  // we get toke from cookie , menas if we have a token or cokkie means we are logeed in otherwise not
    if (!token) {
      return res.status(401).json({
        message: "User not authenticated",
        success: false,
      });
    }

    // use decode for verify of token with our secret key
    const decode = await jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        message: "Invalid token",
        success: false,
      });
    }
    req.id = decode.userId;  //we get token in decode & in token we have userid also as see in genratetoen.js/uils, we store out user in token payload
    next();
    
  } catch (error) {
    console.log("Authentication error:", error);
    return res.status(401).json({
      message: "Invalid or expired token",
      success: false,
    });
  }
};
export default isAuthenticated;