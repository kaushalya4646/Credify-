const BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("credify_token");
}

async function request(method, path, body) {
  const headers = { "Content-Type": "application/json" };
  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await response.json();
  } catch {
    // some responses (like DELETE) have no body
  }

  if (!response.ok) {
    const message = (data && data.error) || "Something went wrong.";
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  del: (path) => request("DELETE", path),
};