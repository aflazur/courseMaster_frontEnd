import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken, clearToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!token) {
      setIsValid(false);
      return;
    }

    let cancelled = false;
    // The token must be accepted by the server; a failed check means no access.
    getMe()
      .then(() => !cancelled && setIsValid(true))
      .catch(() => {
        if (cancelled) return;
        clearToken();
        setIsValid(false);
      });

    return () => {
      cancelled = true;
    };
  }, [token]);

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
