import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../../Context/Auth Context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { userData, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
