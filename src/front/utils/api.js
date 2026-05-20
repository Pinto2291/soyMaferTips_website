/**
 * Utility helper to resolve the backend API URL.
 * In local environments, it falls back to VITE_BACKEND_URL (http://localhost:3001).
 * It features self-healing logic to automatically correct port misconfigurations 
 * (e.g., pointing to port 3000 instead of 3001) and removes trailing slashes.
 */
export const getBackendURL = () => {
  let envUrl = import.meta.env.VITE_BACKEND_URL || "";
  const hostname = window.location.hostname;
  
  // 1. If envUrl is empty, dynamically auto-construct based on host
  if (envUrl === "") {
    if (hostname.endsWith(".github.dev")) {
      envUrl = `https://${hostname.replace("-3000", "-3001")}`;
    } else if (hostname.endsWith(".gitpod.io")) {
      envUrl = `https://${hostname.replace("3000-", "3001-")}`;
    } else {
      envUrl = "http://localhost:3001";
    }
  }

  // 2. Self-healing: if the configured URL points to port 3000, heal it to port 3001
  if (envUrl.includes("-3000.app.github.dev")) {
    envUrl = envUrl.replace("-3000.app.github.dev", "-3001.app.github.dev");
  } else if (envUrl.includes("3000-")) {
    envUrl = envUrl.replace("3000-", "3001-");
  } else if (envUrl.includes("localhost:3000")) {
    envUrl = envUrl.replace("localhost:3000", "localhost:3001");
  } else if (envUrl.includes("127.0.0.1:3000")) {
    envUrl = envUrl.replace("127.0.0.1:3000", "127.0.0.1:3001");
  }

  // 3. Prevent double slashes by stripping trailing slash
  if (envUrl.endsWith("/")) {
    envUrl = envUrl.slice(0, -1);
  }
  
  return envUrl;
};
