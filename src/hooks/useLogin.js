import api from "../lib/api";
import { apiRoutes } from "../lib/constants/apiRoutes";
import { useAuthStorage } from "./useAuthStorage";

export function useLogin() {
  const { setAuth } = useAuthStorage();

  const login = async ({ username, password }) => {
    try {
      console.log(`➡️ Requesting Login: ${apiRoutes.login}`);
      const response = await api.post(apiRoutes.login, { username, password });
      console.log(`✅ Response from Login:`, response);

      if (response.success) {
        const token = response.data?.access_token;
        if (token) {
          setAuth(token);
        }
        return { success: true };
      } else {
        return { success: false, error: response.error };
      }
    } catch (error) {
      console.error("❌ Login error:", error.message);
      return { success: false, error: error.message };
    }
  };

  return { login };
}
