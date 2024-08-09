import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function ProtectedRoute({ children }) {
  const TOKEN_KEY = "jwt_token";
  const REFRESH_TOKEN_KEY = "refresh_token";

  const getToken = () => localStorage.getItem(TOKEN_KEY);
  const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

  const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
  const setRefreshToken = (token) =>
    localStorage.setItem(REFRESH_TOKEN_KEY, token);

  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyToken = async () => {
      const token = getToken();
      // check if token is present in localstorage or not
      if (!token) {
        navigate("/");
        return;
      }

      try {
        //  Here we are checking if the profile request is not get done and we get an error which means token is expired now we can refresh the token
        await axios.get("https://api.escuelajs.co/api/v1/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLoading(false);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired, try refreshing to get new access token
          await refreshToken();
        } else {
          clearTokens();
          navigate("/");
        }
      }
    };

    verifyToken();
  }, [navigate]);

  const refreshToken = async () => {
    try {
      const response = await axios.post(
        "https://api.escuelajs.co/api/v1/auth/refresh-token",
        { refreshToken: getRefreshToken() }
      );
      setToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
      // Here We Retry verifying the token if in case it is working or not
      await verifyToken();
    } catch (error) {
      clearTokens();
      navigate("/");
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return children;
}
