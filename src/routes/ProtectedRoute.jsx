// src/routes/ProtectedRoute.js
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/hooks/useAuth";
import PropTypes from "prop-types";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; 
  }

  return user ? children : <Navigate to="/signin" />;
};
ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
