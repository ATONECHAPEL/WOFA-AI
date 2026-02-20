// api.js - WOFA AI Frontend API Helper (Auto Local + Production - Feb 2026)

const API_BASE =
  window.location.hostname.includes("localhost")
    ? "http://localhost:5000/api"
    : "https://wofa-ai-backend.onrender.com/api";

/* =========================
   API RESPONSE HANDLER
   ========================= */
async function handleResponse(res) {
  let data;

  try {
    data = await res.json();
  } catch (err) {
    throw new Error("Server returned invalid JSON response.");
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

/* =========================
   POST REQUEST HELPER
   ========================= */
async function apiPost(endpoint, body = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("❌ API POST Error:", err.message);
    throw err;
  }
}

/* =========================
   GET REQUEST HELPER
   ========================= */
async function apiGet(endpoint) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "GET"
    });

    return await handleResponse(res);
  } catch (err) {
    console.error("❌ API GET Error:", err.message);
    throw err;
  }
}
