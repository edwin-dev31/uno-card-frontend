import api from "../lib/api";
import { apiRoutes } from "../lib/constants/apiRoutes";

export function useRegister() {
  const register = async ({ username, email, password }) => {
    try {
      console.log(`➡️ Requesting Register: ${apiRoutes.register}`);
      const response = await api.post(apiRoutes.register, { username, email, password });
      console.log(`✅ Response from Register:`, response);

      return response;
    } catch (error) {
      console.error("❌ Register error:", error.message);
      return { success: false, error: error.message };
    }
  };

  return { register };
}
