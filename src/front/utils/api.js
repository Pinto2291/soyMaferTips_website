/**
 * Utility helper to resolve the backend API URL.
 * In local environments, it falls back to VITE_BACKEND_URL (http://localhost:3001).
 * In remote environments like GitHub Codespaces or Gitpod, it dynamically constructs 
 * the forwarded port 3001 URL to prevent connection failures or CORS blocking.
 */
export const getBackendURL = () => {
  let envUrl = import.meta.env.VITE_BACKEND_URL || "";
  
  const isLocalhost = envUrl.includes("localhost") || envUrl.includes("127.0.0.1") || envUrl === "";
  const hostname = window.location.hostname;
  
  if (isLocalhost) {
    // GitHub Codespaces: https://[codespace-name]-3000.app.github.dev
    if (hostname.endsWith(".github.dev")) {
      return `https://${hostname.replace("-3000", "-3001")}`;
    }
    // Gitpod: https://3000-[gitpod-name].[region].gitpod.io
    if (hostname.endsWith(".gitpod.io")) {
      return `https://${hostname.replace("3000-", "3001-")}`;
    }
  }
  
  return envUrl;
};
