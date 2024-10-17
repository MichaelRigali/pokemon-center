import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, token }) => {
  // Debugging log to see if token is being passed correctly
  console.log("Token in PrivateRoute:", token);

  // Check if token exists, pass the token to the protected component if it exists
  if (token) {
    // Clone the element and pass the token prop to it
    return React.cloneElement(element, { token });
  } else {
    // Redirect to login if no token is provided
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
