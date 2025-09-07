const API_BASE_URL = "http://localhost:1731/api";

const handleResponse = async (response) => {
  if (response.status === 204) { // No Content
    return { success: true, data: null };
  }

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.message || `Error: ${response.status}`,
    };
  }

  return { success: true, data };
};

const handleError = (error) => {
  console.error("Error en la API:", error);
  return {
    success: false,
    error: "No se pudo conectar al servidor. Revisa la conexión.",
  };
};

const api = {
  async get(endpoint, headers = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "GET",
        headers,
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },

  async post(endpoint, body, headers = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers,
        },
        body: JSON.stringify(body),
      });
      return handleResponse(response);
    } catch (error) {
      return handleError(error);
    }
  },
};

export default api;