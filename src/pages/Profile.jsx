import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const TOKEN_KEY = "jwt_token";
  const REFRESH_TOKEN_KEY = "refresh_token";

  const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

  const getToken = () => localStorage.getItem(TOKEN_KEY);
  const clearTokens = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
  };

  const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
  const setRefreshToken = (token) =>
    localStorage.setItem(REFRESH_TOKEN_KEY, token);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(
          'https://api.escuelajs.co/api/v1/auth/profile',
          {
            headers: {
              Authorization: `Bearer ${getToken()}`
            }
          }
        );
        setUser(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token expired, try refreshing
          await refreshToken();
        } else {
          console.error('Failed to fetch user profile:', error);
          clearTokens();
          navigate('/');
        }
      }
    };

    const refreshToken = async () => {
      try {
        const response = await axios.post(
          'https://api.escuelajs.co/api/v1/auth/refresh-token',
          { refreshToken: getRefreshToken() }
        );
        setToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        // Retry fetching user profile
        await fetchUserProfile();
      } catch (error) {
        clearTokens();
        navigate('/');
      }
    };

    fetchUserProfile();
  }, [navigate]);

  return (
    <div className="flex justify-center items-center h-screen bg-slate-200">
      {user ? (
        <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow">
          <div>
            <img className="rounded-t-lg" src={user.avatar} alt="User Avatar" />
          </div>
          <div className="p-5">
            <div >
              <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900">
                {user.name}
              </h5>
            </div>
            <p className="mb-3 font-normal text-gray-700">
              {user.email}
            </p>
            <button
              type="button"
              className="focus:outline-none text-white bg-red-700 hover:bg-red-800 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
              onClick={() => {
                clearTokens();
                navigate('/');
              }}
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
