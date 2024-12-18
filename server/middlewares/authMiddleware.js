require('dotenv').config();

const { message } = require('./sendAlert');
const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token; // Use 'cookies' to fetch the token
    if (!token) {
      // Send the alert message, URL, and display time in seconds
      return res.send(message('Sign In to visit Dashboard 🗓️', '/admin/', 3));
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to the request object

    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error('Authentication error:', error.message);
    return res.status(403).json({ message: "Forbidden" });
  }
};

const isLoggedIn = (req, res, next) => {
  const token = req.cookies.token; // Retrieve the token from cookies

  if (token) {
    try {
      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use the correct secret key
      req.user = decoded; // Attach the decoded user data to the request
      return res.redirect("/admin/dashboard"); // Redirect to the dashboard if logged in
    } catch (error) {
      console.log("Invalid or expired token:", error);
    }
  }

  next(); // Proceed to the login page if not logged in
};

module.exports = { authMiddleware, isLoggedIn };
