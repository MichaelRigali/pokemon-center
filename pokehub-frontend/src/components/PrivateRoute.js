// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, token }) => {
  return token ? element : <Navigate to="/login" />;
};

export default PrivateRoute;
