import { useMemo } from "react";
import api from "../lib/api";
import { apiRoutes } from "../lib/constants/apiRoutes";

export function useAuthStorage() {
  const token = localStorage.getItem("uno_access_token");

  const authHeaders = useMemo(() => {
    return token ? { Authorization: `Bearer ${token}` } : {};
  }, [token]);

  const clearAuth = () => {
    localStorage.removeItem("uno_access_token");
    window.dispatchEvent(new Event("storage"));
  };

  const setAuth = (newToken) => {
    if (!newToken) {
      console.error("setAuth called with no token");
      return;
    }
    localStorage.setItem("uno_access_token", newToken);
    window.dispatchEvent(new Event("storage"));
  };

  const logout = async () => {
    try {
      await api.post(apiRoutes.logout, {}, authHeaders);
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      clearAuth();
    }
  };

  return {
    token,
    authHeaders,
    clearAuth,
    setAuth,
    logout,
    isAuthenticated: !!token,
  };
}
