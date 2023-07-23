// Middleware to check if user is admin
const isUserAdmin = (req, res, next) => {
    // Check if user is authenticated and has admin role
    // Replace this with your actual authentication and role check logic
    const isAuthenticated = true; // Replace with your authentication check
    const isAdminUser = true; // Replace with your admin role check
  
    if (isAuthenticated && isAdminUser) {
      // User is authenticated and has admin role, allow access to the route
      next();
    } else {
      // User is not authorized, redirect to an error page or show an error message
      res.status(403).send('Access denied');
    }
  };
  
module.exports = { isUserAdmin };