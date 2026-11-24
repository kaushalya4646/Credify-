const BASE_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem("credify_token");
}

// Shown on the login page after a forced logout.
export const LOGIN_NOTICE_KEY = "credify_login_notice";
let forcedLogout = false;

// The account was suspended while signed in: clear the session and send the
// user to the login page with an explanation. Pages load several requests at
// once, so only the first one acts.
function logOutSuspendedUser(message) {
  if (forcedLogout) return;
  forcedLogout = true;
  localStorage.removeItem("credify_token");
  localStorage.removeItem("credify_user");
  try {
    sessionStorage.setItem(LOGIN_NOTICE_KEY, message);
  } catch {
    // Storage can be unavailable (e.g. private mode); the redirect still happens.
  }
  window.location.replace("/login");
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
    // Only for signed-in requests: a suspended user trying to log in just sees the message.
    if (token && data && data.code === "ACCOUNT_SUSPENDED") {
      logOutSuspendedUser("Your account has been suspended. Contact an administrator if you think this is a mistake.");
    }
    throw new Error(message);
  }

  return data;
}

export const api = {
  get: (path) => request("GET", path),
  post: (path, body) => request("POST", path, body),
  put: (path, body) => request("PUT", path, body),
  delete: (path) => request("DELETE", path),
};